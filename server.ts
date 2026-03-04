import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || "sellerpulse-secret-key-123";
const db = new Database("sellerpulse.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    category TEXT NOT NULL,
    sub_category TEXT NOT NULL,
    location TEXT NOT NULL,
    demand_score TEXT NOT NULL,
    optimal_price REAL NOT NULL,
    profit_margin REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )
`);

// Migration: Add new columns if they don't exist
const tableInfo = db.prepare("PRAGMA table_info(users)").all() as any[];
const columnNames = tableInfo.map(col => col.name);

if (!columnNames.includes("mobile")) {
  db.exec("ALTER TABLE users ADD COLUMN mobile TEXT");
}
if (!columnNames.includes("gender")) {
  db.exec("ALTER TABLE users ADD COLUMN gender TEXT");
}
if (!columnNames.includes("location")) {
  db.exec("ALTER TABLE users ADD COLUMN location TEXT");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ error: "Forbidden" });
      req.user = user;
      next();
    });
  };

  // API Routes
  app.post("/api/auth/register", async (req, res) => {
    const { email, password, name, mobile, gender, location } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const stmt = db.prepare("INSERT INTO users (email, password, name, mobile, gender, location) VALUES (?, ?, ?, ?, ?, ?)");
      const info = stmt.run(email, hashedPassword, name, mobile, gender, location);
      
      const userId = Number(info.lastInsertRowid);
      const token = jwt.sign({ id: userId, email, name, mobile, gender, location }, JWT_SECRET);
      res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" });
      res.json({ user: { id: userId, email, name, mobile, gender, location } });
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.code === "SQLITE_CONSTRAINT") {
        res.status(400).json({ error: "Email already exists" });
      } else {
        res.status(500).json({ error: "Registration failed" });
      }
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const user: any = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      const token = jwt.sign({ 
        id: user.id, 
        email: user.email, 
        name: user.name,
        mobile: user.mobile,
        gender: user.gender,
        location: user.location
      }, JWT_SECRET);
      res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" });
      res.json({ user: { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        mobile: user.mobile,
        gender: user.gender,
        location: user.location
      } });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.get("/api/auth/me", authenticateToken, (req: any, res) => {
    res.json({ user: req.user });
  });

  app.post("/api/predictions", authenticateToken, (req: any, res) => {
    const { category, subCategory, location, demandScore, optimalPrice, profitMargin } = req.body;
    try {
      const stmt = db.prepare("INSERT INTO predictions (user_id, category, sub_category, location, demand_score, optimal_price, profit_margin) VALUES (?, ?, ?, ?, ?, ?, ?)");
      stmt.run(req.user.id, category, subCategory, location, demandScore, optimalPrice, profitMargin);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to save prediction" });
    }
  });

  app.get("/api/predictions/recent", (req, res) => {
    try {
      const predictions = db.prepare(`
        SELECT p.*, u.name as user_name 
        FROM predictions p 
        JOIN users u ON p.user_id = u.id 
        ORDER BY p.created_at DESC 
        LIMIT 10
      `).all();
      res.json({ predictions });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch predictions" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
