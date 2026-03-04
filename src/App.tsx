/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  DollarSign, 
  Package, 
  Search, 
  AlertCircle, 
  ArrowRight, 
  Loader2, 
  BarChart3,
  ChevronRight,
  Info,
  CheckCircle2,
  XCircle,
  X,
  LogOut,
  Star,
  Heart,
  ExternalLink,
  Download,
  Upload,
  Users,
  User,
  Mail,
  Phone,
  MapPin,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend
} from 'recharts';
import { analyzeProduct, getMarketTrends, MarketAnalysis } from './services/geminiService';
import { PRODUCT_CATALOG, Product } from './data/products';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Auth from './components/Auth';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mock data for initial view - Expanded to 30 days
const MOCK_TRENDS = Array.from({ length: 30 }, (_, i) => ({
  name: `Day ${i + 1}`,
  volume: Math.floor(Math.random() * 100) + 50,
  revenue: Math.floor(Math.random() * 5000) + 2000,
  trend: Math.floor(Math.random() * 400) + 100,
  returns: Math.floor(Math.random() * 10),
}));

const MOCK_CATEGORY_DATA = [
  { 
    category: 'Mobiles', 
    demand: 95, 
    risk: 15, 
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80' 
  },
  { 
    category: 'RC Cars', 
    demand: 55, 
    risk: 30, 
    image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&w=400&q=80' 
  },
  { 
    category: 'Sofas', 
    demand: 75, 
    risk: 15, 
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80' 
  },
  { 
    category: 'Bikes', 
    demand: 60, 
    risk: 25, 
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=400&q=80' 
  },
  { 
    category: 'Chairs', 
    demand: 80, 
    risk: 10, 
    image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=400&q=80' 
  },
  { 
    category: 'Laptops', 
    demand: 88, 
    risk: 12, 
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=400&q=80' 
  },
  { 
    category: 'Sneakers', 
    demand: 92, 
    risk: 20, 
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80' 
  },
  { 
    category: 'Watches', 
    demand: 70, 
    risk: 18, 
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80' 
  },
  { 
    category: 'Cameras', 
    demand: 45, 
    risk: 35, 
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80' 
  },
  { 
    category: 'Headphones', 
    demand: 85, 
    risk: 10, 
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80' 
  },
  { 
    category: 'Gaming', 
    demand: 90, 
    risk: 22, 
    image: 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?auto=format&fit=crop&w=400&q=80' 
  },
  { 
    category: 'Tablets', 
    demand: 78, 
    risk: 15, 
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=400&q=80' 
  },
  { 
    category: 'Appliances', 
    demand: 65, 
    risk: 20, 
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=400&q=80' 
  },
  { 
    category: 'Kitchen', 
    demand: 82, 
    risk: 12, 
    image: 'https://images.unsplash.com/photo-1594385208974-2e75f9d8ca28?auto=format&fit=crop&w=400&q=80' 
  },
  { 
    category: 'Fitness', 
    demand: 88, 
    risk: 8, 
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=400&q=80' 
  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1e293b] border border-slate-700 p-3 rounded-xl shadow-2xl">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-700 pb-1">{label}</p>
        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-xs font-medium text-slate-300 capitalize">{entry.name}:</span>
              </div>
              <span className="text-xs font-bold text-white">
                {entry.name === 'revenue' ? `₹${entry.value.toLocaleString()}` : `${entry.value} units`}
              </span>
            </div>
          ))}
        </div>
        {payload.length > 1 && payload[0].name === 'volume' && (
          <div className="mt-2 pt-2 border-t border-slate-700">
            <p className="text-[9px] text-slate-500 italic">
              Efficiency: {Math.round((payload[0].value / (payload[0].value + (payload[1].name === 'returns' ? payload[1].value : 0))) * 100)}%
            </p>
          </div>
        )}
      </div>
    );
  }
  return null;
};

const MOCK_STOCK_DATA: Record<string, { time: string; price: number }[]> = {
  'Sneakers': [
    { time: '09:00', price: 12000 }, { time: '10:00', price: 12200 }, { time: '11:00', price: 11800 },
    { time: '12:00', price: 12500 }, { time: '13:00', price: 12300 }, { time: '14:00', price: 12800 },
    { time: '15:00', price: 13000 }, { time: '16:00', price: 12900 }, { time: '17:00', price: 13200 }
  ],
  'Watches': [
    { time: '09:00', price: 25000 }, { time: '10:00', price: 24800 }, { time: '11:00', price: 25500 },
    { time: '12:00', price: 26000 }, { time: '13:00', price: 25800 }, { time: '14:00', price: 26500 },
    { time: '15:00', price: 27000 }, { time: '16:00', price: 26800 }, { time: '17:00', price: 27500 }
  ],
  'Cameras': [
    { time: '09:00', price: 45000 }, { time: '10:00', price: 45500 }, { time: '11:00', price: 44800 },
    { time: '12:00', price: 46000 }, { time: '13:00', price: 45800 }, { time: '14:00', price: 46500 },
    { time: '15:00', price: 47000 }, { time: '16:00', price: 46800 }, { time: '17:00', price: 47500 }
  ],
  'Headphones': [
    { time: '09:00', price: 18000 }, { time: '10:00', price: 18500 }, { time: '11:00', price: 17800 },
    { time: '12:00', price: 19000 }, { time: '13:00', price: 18800 }, { time: '14:00', price: 19500 },
    { time: '15:00', price: 20000 }, { time: '16:00', price: 19800 }, { time: '17:00', price: 20500 }
  ],
  'Gaming': [
    { time: '09:00', price: 35000 }, { time: '10:00', price: 35500 }, { time: '11:00', price: 34800 },
    { time: '12:00', price: 36000 }, { time: '13:00', price: 35800 }, { time: '14:00', price: 36500 },
    { time: '15:00', price: 37000 }, { time: '16:00', price: 36800 }, { time: '17:00', price: 37500 }
  ]
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analyze' | 'trends' | 'catalog' | 'wishlist' | 'compare'>('dashboard');
  const [wishlist, setWishlist] = useState<string[]>([]); // Store product IDs
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [catalogSearchQuery, setCatalogSearchQuery] = useState('');
  const [catalogCategory, setCatalogCategory] = useState('All');
  const [selectedStockCategory, setSelectedStockCategory] = useState('Sneakers');
  const [category, setCategory] = useState('Electronics');
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('INDIA');
  const [month, setMonth] = useState('March');
  const [costPrice, setCostPrice] = useState<string>('');
  const [productImage, setProductImage] = useState<string | null>(null);
  const [subCategory, setSubCategory] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<MarketAnalysis | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [isLoadingTrends, setIsLoadingTrends] = useState(false);
  const [trendsError, setTrendsError] = useState<string | null>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<any[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchRecentAnalyses();
  }, []);

  const fetchRecentAnalyses = async () => {
    try {
      const response = await fetch('/api/predictions/recent');
      if (response.ok) {
        const data = await response.json();
        setRecentAnalyses(data.predictions);
      }
    } catch (error) {
      console.error("Failed to fetch recent analyses", error);
    }
  };

  useEffect(() => {
    if (user && activeTab === 'trends') {
      fetchTrends();
    }
  }, [activeTab, category, user]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        if (data.user.location) {
          setLocation(data.user.location);
        }
      }
    } catch (error) {
      console.error("Auth check failed", error);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const fetchTrends = async () => {
    setIsLoadingTrends(true);
    setTrendsError(null);
    try {
      const trends = await getMarketTrends(category);
      setTrendingProducts(trends);
    } catch (error) {
      console.error("Failed to fetch trends", error);
      setTrendsError("Failed to fetch market trends. Please check your connection and try again.");
    } finally {
      setIsLoadingTrends(false);
    }
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!costPrice) return;
    
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setAnalysisError(null);
    try {
      const result = await analyzeProduct(category, subCategory, location, month, parseFloat(costPrice), productImage);
      setAnalysisResult(result);
      
      // Save prediction to backend
      await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          subCategory: subCategory || category,
          location,
          demandScore: result.demandScore,
          optimalPrice: result.pricingSuggestion.optimalPrice,
          profitMargin: result.pricingSuggestion.expectedProfitMargin
        })
      });
      fetchRecentAnalyses();
    } catch (error) {
      console.error("Analysis failed", error);
      setAnalysisError("AI analysis failed to retrieve data. This can happen due to network issues or API limits. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredCatalog = PRODUCT_CATALOG.filter(p => {
    const matchesCategory = category === 'All' || p.category === category;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.subCategory.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectFromCatalog = (product: Product) => {
    setCategory(product.category);
    setSubCategory(product.subCategory);
    setCostPrice(product.baseCost.toString());
    setProductImage(product.image);
    setActiveTab('analyze');
  };

  const exportToCSV = () => {
    const headers = ['Period', 'Sales Volume', 'Revenue (INR)', 'Returns', 'Trend Index'];
    const rows = MOCK_TRENDS.slice().reverse().map(day => [
      day.name,
      day.volume,
      day.revenue,
      day.returns,
      day.trend
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `market_performance_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  if (!user) {
    return <Auth onSuccess={setUser} />;
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex text-[#e2e8f0]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111827] border-r border-slate-800 flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-tight text-white">TradeLens <span className="text-brand-500">AI</span></h1>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <SidebarItem 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <SidebarItem 
            label="Product Catalog" 
            active={activeTab === 'catalog'} 
            onClick={() => setActiveTab('catalog')} 
          />
          <SidebarItem 
            label="Market Predictor" 
            active={activeTab === 'analyze'} 
            onClick={() => setActiveTab('analyze')} 
          />
          <SidebarItem 
            label="Market Trends" 
            active={activeTab === 'trends'} 
            onClick={() => setActiveTab('trends')} 
          />
          <SidebarItem 
            label="Wishlist" 
            active={activeTab === 'wishlist'} 
            onClick={() => setActiveTab('wishlist')} 
          />
          <SidebarItem 
            label="Compare" 
            active={activeTab === 'compare'} 
            onClick={() => setActiveTab('compare')} 
          />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-900/20 transition-all"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-[#111827]/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-10 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-white capitalize tracking-wide">
              {activeTab === 'analyze' ? 'Market Predictor' : activeTab === 'wishlist' ? 'My Wishlist' : activeTab.replace('-', ' ')}
            </h2>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-brand-900/20 border border-brand-500/30 rounded-full">
              <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest">Live Feed Active</span>
            </div>
          </div>
          <div className="flex items-center gap-4 relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 p-1.5 hover:bg-slate-800 rounded-2xl transition-all group"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white group-hover:text-brand-400 transition-colors">{user.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.location || 'India'}</p>
              </div>
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 shadow-sm overflow-hidden group-hover:border-brand-500/50 transition-all">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}&backgroundColor=b6e3f4,c0aede,d1d4f9${user.gender === 'Female' ? '&top[]=longHair,bob,curvy' : '&top[]=shortHair,shaggy,frizzle'}`} 
                    alt="Avatar" 
                    referrerPolicy="no-referrer" 
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-brand-500 border-2 border-[#111827] w-4 h-4 rounded-full flex items-center justify-center">
                  <ChevronDown size={10} className="text-white" />
                </div>
              </div>
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-20" 
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 w-72 bg-[#1e293b] border border-slate-800 rounded-3xl shadow-2xl z-30 overflow-hidden"
                  >
                    <div className="p-6 border-b border-slate-800 bg-slate-900/50">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center overflow-hidden">
                          <img 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}&backgroundColor=b6e3f4,c0aede,d1d4f9${user.gender === 'Female' ? '&top[]=longHair,bob,curvy' : '&top[]=shortHair,shaggy,frizzle'}`} 
                            alt="Avatar" 
                            referrerPolicy="no-referrer" 
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-white">{user.name}</h4>
                          <p className="text-[10px] font-bold text-brand-400 uppercase tracking-widest">Premium Seller</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-slate-400">
                          <Mail size={14} className="shrink-0" />
                          <span className="text-xs truncate">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-400">
                          <Phone size={14} className="shrink-0" />
                          <span className="text-xs">{user.mobile || 'Not provided'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-400">
                          <MapPin size={14} className="shrink-0" />
                          <span className="text-xs">{user.location || 'India'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-400">
                          <User size={14} className="shrink-0" />
                          <span className="text-xs">{user.gender || 'Not specified'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-red-400 hover:bg-red-900/20 transition-all"
                      >
                        <LogOut size={18} />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Live Market Pulse - Real-time feel */}
                <div className="bg-slate-900 rounded-2xl p-4 overflow-hidden relative border border-slate-800">
                  <div className="flex items-center gap-4 animate-marquee whitespace-nowrap">
                    <span className="flex items-center gap-2 text-xs font-bold text-brand-400">
                      <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
                      LIVE MARKET PULSE:
                    </span>
                    <span className="text-xs text-slate-300 font-medium">iPhone 15 Pro demand surged by 12% in Mumbai</span>
                    <span className="text-slate-700">•</span>
                    <span className="text-xs text-slate-300 font-medium">RC Car category seeing high returns in Delhi NCR</span>
                    <span className="text-slate-700">•</span>
                    <span className="text-xs text-slate-300 font-medium">New trend detected: Sustainable Fashion in Bangalore</span>
                    <span className="text-slate-700">•</span>
                    <span className="text-xs text-slate-300 font-medium">Sony WH-1000XM5 price drop across major retailers</span>
                    <span className="text-slate-700">•</span>
                    <span className="text-xs text-slate-300 font-medium">Summer category demand starting to rise in South India</span>
                    
                    {/* Duplicate for seamless loop */}
                    <span className="text-slate-700 ml-8">•</span>
                    <span className="text-xs text-slate-300 font-medium">iPhone 15 Pro demand surged by 12% in Mumbai</span>
                    <span className="text-slate-700">•</span>
                    <span className="text-xs text-slate-300 font-medium">RC Car category seeing high returns in Delhi NCR</span>
                    <span className="text-slate-700">•</span>
                    <span className="text-xs text-slate-300 font-medium">New trend detected: Sustainable Fashion in Bangalore</span>
                    <span className="text-slate-700">•</span>
                    <span className="text-xs text-slate-300 font-medium">Sony WH-1000XM5 price drop across major retailers</span>
                    <span className="text-slate-700">•</span>
                    <span className="text-xs text-slate-300 font-medium">Summer category demand starting to rise in South India</span>
                  </div>
                </div>

                {/* Stats Grid - Electronics Baseline */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard 
                    title="Electronics Demand" 
                    value="85%" 
                    subtitle="India Market Average" 
                    trend="High Demand"
                  />
                  <StatCard 
                    title="Model Accuracy" 
                    value="92%" 
                    subtitle="Historical validation" 
                    trend="+1% vs Last Version"
                  />
                  <StatCard 
                    title="Global Analyses" 
                    value={recentAnalyses.length.toString()} 
                    subtitle="Recent predictions made" 
                    trend="Live"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Real-time Stock Chart */}
                  <div className="lg:col-span-2 bg-[#1e293b] p-6 rounded-2xl border border-slate-800 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white">Category Market Velocity</h3>
                      <p className="text-sm text-slate-400">Real-time price fluctuations across major Indian hubs</p>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                      {Object.keys(MOCK_STOCK_DATA).map(cat => (
                        <button 
                          key={cat}
                          onClick={() => setSelectedStockCategory(cat)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
                            selectedStockCategory === cat 
                              ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20" 
                              : "bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700"
                          )}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={MOCK_STOCK_DATA[selectedStockCategory]}>
                        <defs>
                          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis 
                          dataKey="time" 
                          stroke="#64748b" 
                          fontSize={10} 
                          tickLine={false} 
                          axisLine={false} 
                        />
                        <YAxis 
                          stroke="#64748b" 
                          fontSize={10} 
                          tickLine={false} 
                          axisLine={false}
                          tickFormatter={(value) => `₹${value/1000}k`}
                        />
                        <Tooltip 
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-[#0f172a] border border-slate-800 p-3 rounded-xl shadow-2xl backdrop-blur-md">
                                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{selectedStockCategory} • {label}</p>
                                  <p className="text-lg font-bold text-brand-400">₹{payload[0].value?.toLocaleString()}</p>
                                  <div className="flex items-center gap-1 mt-1">
                                    <TrendingUp size={10} className="text-brand-400" />
                                    <span className="text-[10px] text-brand-400 font-bold">Real-time Velocity</span>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="price" 
                          stroke="#10b981" 
                          strokeWidth={3} 
                          fillOpacity={1}
                          fill="url(#colorPrice)"
                          dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#0f172a' }}
                          activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981', className: "shadow-lg shadow-brand-500/50" }}
                          animationDuration={1500}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                  {/* Recent Global Analyses */}
                  <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 shadow-sm">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                      <Users size={18} className="text-brand-500" />
                      Recent Global Analyses
                    </h3>
                    <div className="space-y-4">
                      {recentAnalyses.length === 0 ? (
                        <p className="text-sm text-slate-500 italic">No recent analyses found.</p>
                      ) : (
                        recentAnalyses.map((analysis, i) => (
                          <div key={i} className="p-3 bg-slate-900/50 rounded-xl border border-slate-800 flex items-center justify-between group">
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-white truncate">{analysis.sub_category}</p>
                              <p className="text-[10px] text-slate-500 uppercase tracking-widest">{analysis.location} • {analysis.user_name}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className={cn(
                                "text-[10px] font-bold uppercase",
                                analysis.demand_score === 'High' ? "text-brand-400" : "text-blue-400"
                              )}>{analysis.demand_score} Demand</p>
                              <p className="text-[10px] font-mono text-slate-400">₹{Math.round(analysis.optimal_price).toLocaleString()}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <button 
                      onClick={() => setActiveTab('trends')}
                      className="w-full mt-6 py-2 text-xs font-bold text-slate-400 hover:text-white border border-slate-800 rounded-lg hover:bg-slate-800 transition-all"
                    >
                      View All Trends
                    </button>
                  </div>
                </div>

                {/* All Categories Demand Overview */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white">All Categories Demand Overview</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {MOCK_CATEGORY_DATA.map((item) => (
                      <div key={item.category} className="bg-[#1e293b] p-4 rounded-2xl border border-slate-800 shadow-sm flex flex-col items-center text-center group hover:border-brand-500 transition-colors">
                        <div className="w-full aspect-square rounded-xl bg-slate-900 mb-3 overflow-hidden border border-slate-800">
                          <img 
                            src={item.image} 
                            alt={item.category} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://loremflickr.com/400/400/${item.category.toLowerCase().replace(/\s+/g, ',')}`;
                            }}
                          />
                        </div>
                        <h4 className="font-bold text-white text-sm mb-1">{item.category}</h4>
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-500" style={{ width: `${item.demand}%` }} />
                          </div>
                          <span className="text-[10px] font-bold text-brand-500">{item.demand}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Last Analysis Summary (Conditional) */}
                {analysisResult && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-brand-900 rounded-2xl p-6 text-white shadow-xl border border-brand-700"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-500/20 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="text-brand-400" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">Last Analysis Summary</h4>
                          <p className="text-xs text-brand-300 uppercase tracking-widest">Category: {category} • Location: {location} • Month: {month}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setActiveTab('analyze')}
                        className="px-4 py-2 bg-brand-600 hover:bg-brand-500 rounded-xl text-sm font-bold transition-colors"
                      >
                        View Full Report
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 border-t border-brand-800 pt-6">
                      <div>
                        <p className="text-xs font-bold text-brand-400 uppercase mb-2">Pricing Insight</p>
                        <p className="text-sm leading-relaxed text-slate-200">
                          Optimal price found at <span className="text-white font-bold">{analysisResult.pricingSuggestion.currency}{Math.round(analysisResult.pricingSuggestion.optimalPrice)}</span> with a <span className="text-brand-400 font-bold">{Math.round(analysisResult.pricingSuggestion.expectedProfitMargin)}%</span> margin.
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-brand-400 uppercase mb-2">Risk Classification</p>
                        <p className="text-sm leading-relaxed text-slate-200">
                          {analysisResult.marketInsights}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-white flex items-center gap-2">
                        <BarChart3 size={18} className="text-brand-500" />
                        30-Day Sales & Returns Velocity
                      </h3>
                      <div className="flex gap-2">
                         <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase"><div className="w-2 h-2 bg-brand-500 rounded-full" /> Sales</span>
                         <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase"><div className="w-2 h-2 bg-red-400 rounded-full" /> Returns</span>
                      </div>
                    </div>
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={MOCK_TRENDS}>
                          <defs>
                            <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f87171" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fontSize: 10, fill: '#94a3b8'}} 
                            interval={4}
                          />
                          <YAxis hide />
                          <Tooltip 
                            content={<CustomTooltip />}
                            cursor={{ stroke: '#334155', strokeWidth: 1 }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="volume" 
                            stroke="#22c55e" 
                            strokeWidth={2} 
                            fillOpacity={1} 
                            fill="url(#colorVolume)" 
                            activeDot={{ r: 6, strokeWidth: 0, fill: '#22c55e' }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="returns" 
                            stroke="#f87171" 
                            strokeWidth={2} 
                            fillOpacity={1} 
                            fill="url(#colorReturns)" 
                            activeDot={{ r: 6, strokeWidth: 0, fill: '#f87171' }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-white flex items-center gap-2">
                        <TrendingUp size={18} className="text-blue-400" />
                        Category Demand vs Risk
                      </h3>
                    </div>
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={MOCK_CATEGORY_DATA}>
                          <PolarGrid stroke="#334155" />
                          <PolarAngleAxis dataKey="category" tick={{fontSize: 11, fill: '#94a3b8', fontWeight: 500}} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} hide />
                          <Radar
                            name="Demand"
                            dataKey="demand"
                            stroke="#22c55e"
                            fill="#22c55e"
                            fillOpacity={0.5}
                          />
                          <Radar
                            name="Risk"
                            dataKey="risk"
                            stroke="#f87171"
                            fill="#f87171"
                            fillOpacity={0.5}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1e293b', 
                              borderRadius: '12px', 
                              border: '1px solid #334155', 
                              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)',
                              color: '#f8fafc'
                            }}
                            itemStyle={{ color: '#f8fafc', fontSize: '12px' }}
                          />
                          <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Historical Data Log */}
                <div className="bg-[#1e293b] rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                    <h3 className="font-bold text-white flex items-center gap-2">
                      <BarChart3 size={18} className="text-slate-500" />
                      Historical Performance Log (Last 30 Days)
                    </h3>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 text-xs font-bold text-slate-300 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors">
                        Filter
                      </button>
                      <button 
                        onClick={exportToCSV}
                        className="px-3 py-1.5 text-xs font-bold text-brand-400 bg-brand-900/20 border border-brand-500/30 rounded-lg hover:bg-brand-900/40 transition-colors flex items-center gap-2"
                      >
                        <Download size={14} />
                        Export CSV
                      </button>
                    </div>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 bg-slate-900 z-10">
                        <tr className="border-b border-slate-800">
                          <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Period</th>
                          <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sales Volume</th>
                          <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Revenue (Est.)</th>
                          <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Returns</th>
                          <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Trend Index</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {MOCK_TRENDS.slice().reverse().map((day, i) => (
                          <tr key={i} className="hover:bg-slate-800/50 transition-colors group">
                            <td className="px-6 py-4 text-sm font-medium text-white">{day.name}</td>
                            <td className="px-6 py-4 text-sm font-mono text-slate-400">{day.volume} units</td>
                            <td className="px-6 py-4 text-sm font-mono text-brand-500 font-bold">₹{day.revenue.toLocaleString()}</td>
                            <td className="px-6 py-4 text-sm font-mono text-red-400">
                              <span className="flex items-center gap-1">
                                {day.returns} <span className="text-[10px] text-slate-500">units</span>
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm font-mono text-slate-400">{day.trend}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'wishlist' && (
              <motion.div 
                key="wishlist"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-serif italic text-white">My Saved Products</h3>
                    <p className="text-sm text-slate-400">Products you're tracking for market opportunities</p>
                  </div>
                  <div className="px-4 py-2 bg-[#1e293b] border border-slate-800 rounded-xl text-sm font-bold text-brand-400">
                    {wishlist.length} Items
                  </div>
                </div>

                {wishlist.length === 0 ? (
                  <div className="h-96 flex flex-col items-center justify-center text-slate-500 gap-6 bg-[#1e293b] border border-slate-800 border-dashed rounded-3xl">
                    <div className="p-6 bg-slate-900 rounded-full">
                      <Heart size={48} className="text-slate-700" />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-white mb-2">Your wishlist is empty</p>
                      <p className="text-sm max-w-xs mx-auto">Explore the product catalog and save items you want to track for market trends.</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('catalog')}
                      className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-500/20"
                    >
                      Browse Catalog
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {PRODUCT_CATALOG.filter(p => wishlist.includes(p.id)).map(product => (
                      <motion.div 
                        key={product.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => setSelectedProduct(product)}
                        className="bg-[#1e293b] rounded-2xl border border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer"
                      >
                        <div className="aspect-square bg-slate-900 relative overflow-hidden">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <button 
                            onClick={() => toggleWishlist(product.id)}
                            className="absolute top-2 left-2 p-2 rounded-full bg-red-500 text-white backdrop-blur-md shadow-lg"
                          >
                            <Heart size={16} className="fill-current" />
                          </button>
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-white mb-1 truncate">{product.name}</h4>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-brand-400 font-bold">₹{product.baseCost.toLocaleString()}</span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{product.category}</span>
                          </div>
                          <button 
                            onClick={() => {
                              setCategory(product.category);
                              setSubCategory(product.name);
                              setCostPrice(product.baseCost.toString());
                              setActiveTab('analyze');
                            }}
                            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-all border border-slate-700"
                          >
                            Analyze Market
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'catalog' && (
              <motion.div 
                key="catalog"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-8"
              >
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-96">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input 
                        type="text" 
                        placeholder="Search by name or category..." 
                        value={catalogSearchQuery}
                        onChange={(e) => setCatalogSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-[#1e293b] border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-brand-500 outline-none"
                      />
                    </div>
                    <div className="relative group shrink-0">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          handleImageUpload(e);
                          setActiveTab('analyze');
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <button className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-brand-500/20">
                        <Upload size={16} />
                        <span className="hidden sm:inline">Upload & Analyze</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
                    {['All', 'Electronics', 'Fashion', 'Home', 'Kitchen', 'Sports'].map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setCatalogCategory(cat)}
                        className={cn(
                          "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                          catalogCategory === cat ? "bg-brand-500 text-white" : "bg-[#1e293b] text-slate-300 border border-slate-800 hover:border-slate-700"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {/* Custom Upload Card */}
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-brand-900/10 rounded-2xl border border-brand-500/30 border-dashed overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer flex flex-col items-center justify-center p-6 text-center relative"
                  >
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        handleImageUpload(e);
                        setActiveTab('analyze');
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-16 h-16 bg-brand-500/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-brand-500/30 transition-colors">
                      <Upload className="text-brand-400" size={32} />
                    </div>
                    <h4 className="font-bold text-white mb-2">Analyze Custom Product</h4>
                    <p className="text-xs text-slate-400">Upload an image to start a deep AI market analysis</p>
                  </motion.div>

                  {PRODUCT_CATALOG.filter(product => {
                    const matchesSearch = product.name.toLowerCase().includes(catalogSearchQuery.toLowerCase()) || 
                                         product.category.toLowerCase().includes(catalogSearchQuery.toLowerCase());
                    const matchesCategory = catalogCategory === 'All' || product.category === catalogCategory;
                    return matchesSearch && matchesCategory;
                  }).map(product => (
                    <motion.div 
                      key={product.id}
                      whileHover={{ y: -5 }}
                      onClick={() => setSelectedProduct(product)}
                      className="bg-[#1e293b] rounded-2xl border border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer"
                    >
                      <div className="aspect-square bg-slate-900 relative overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-md rounded-lg text-[10px] font-bold text-white uppercase">
                          {product.category}
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product.id);
                          }}
                          className={cn(
                            "absolute top-2 left-2 p-2 rounded-full backdrop-blur-md transition-all",
                            wishlist.includes(product.id) 
                              ? "bg-red-500 text-white" 
                              : "bg-black/50 text-white hover:bg-black/70"
                          )}
                        >
                          <Heart size={16} className={wishlist.includes(product.id) ? "fill-current" : ""} />
                        </button>
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-white mb-1 truncate">{product.name}</h4>
                        <div className="flex items-center justify-between">
                          <span className="text-brand-400 font-bold">₹{product.baseCost.toLocaleString()}</span>
                          <div className="flex items-center gap-1">
                            <Star size={12} className="text-yellow-500 fill-yellow-500" />
                            <span className="text-xs font-bold text-slate-300">4.5</span>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!compareList.find(p => p.id === product.id)) {
                                setCompareList(prev => [...prev, product]);
                              }
                              setActiveTab('compare');
                            }}
                            className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold rounded-lg transition-all border border-slate-700"
                          >
                            Compare
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectFromCatalog(product);
                            }}
                            className="flex-1 py-2 bg-brand-500 hover:bg-brand-600 text-white text-[10px] font-bold rounded-lg transition-all"
                          >
                            Analyze
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {PRODUCT_CATALOG.filter(product => {
                    const matchesSearch = product.name.toLowerCase().includes(catalogSearchQuery.toLowerCase()) || 
                                         product.category.toLowerCase().includes(catalogSearchQuery.toLowerCase());
                    const matchesCategory = catalogCategory === 'All' || product.category === catalogCategory;
                    return matchesSearch && matchesCategory;
                  }).length === 0 && (
                    <div className="col-span-full py-20 text-center bg-[#1e293b] rounded-3xl border border-slate-800 border-dashed">
                      <div className="inline-flex p-4 bg-slate-900 rounded-full mb-4">
                        <Search size={32} className="text-slate-700" />
                      </div>
                      <h4 className="text-lg font-bold text-white mb-1">No products found</h4>
                      <p className="text-sm text-slate-400">Try adjusting your search or category filters</p>
                      <button 
                        onClick={() => {
                          setCatalogSearchQuery('');
                          setCatalogCategory('All');
                        }}
                        className="mt-4 text-brand-400 text-sm font-bold hover:underline"
                      >
                        Clear all filters
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-6 bg-brand-900/20 border border-brand-500/20 rounded-2xl">
                  <div className="flex gap-4 items-start">
                    <div className="p-2 bg-brand-500/20 rounded-lg">
                      <Package className="text-brand-400" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">Prototype Note</h4>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        This catalog is a curated baseline for the AI model. Predictions are more accurate when you provide specific sub-category details in the Analyze tab.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'analyze' && (
              <motion.div 
                key="analyze"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="bg-[#1e293b] p-8 rounded-2xl border border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-serif italic text-white">Market Prediction Engine</h3>
                  </div>
                  <form onSubmit={handleAnalyze} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Category</label>
                      <select 
                        className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900 text-white outline-none focus:ring-2 focus:ring-brand-500"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option>Electronics</option>
                        <option>Fashion</option>
                        <option>Home</option>
                        <option>Beauty</option>
                        <option>Toys</option>
                        <option>Kitchen</option>
                        <option>Fitness</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Sub-Category</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Mobile, Sofa, RC Car" 
                        className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                        value={subCategory}
                        onChange={(e) => setSubCategory(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Location</label>
                      <input 
                        type="text" 
                        placeholder="e.g. USA, India" 
                        className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Month</label>
                      <select 
                        className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900 text-white outline-none focus:ring-2 focus:ring-brand-500"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                      >
                        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                          <option key={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Cost Price</label>
                      <input 
                        type="number" 
                        placeholder="0.00" 
                        className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                        value={costPrice}
                        onChange={(e) => setCostPrice(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex justify-between items-center">
                        Product Image
                        {productImage && (
                          <button 
                            type="button"
                            onClick={() => setProductImage(null)}
                            className="text-[10px] text-red-400 hover:text-red-500 font-bold uppercase"
                          >
                            Clear
                          </button>
                        )}
                      </label>
                      <div className="relative group">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className={cn(
                          "w-full px-4 py-3 rounded-xl border border-dashed flex items-center justify-center gap-2 transition-all overflow-hidden",
                          productImage ? "border-brand-500 bg-brand-900/20" : "border-slate-700 hover:border-slate-600 bg-slate-900"
                        )}>
                          {productImage ? (
                            <div className="flex items-center gap-3 w-full">
                              <img src={productImage} alt="Preview" className="w-8 h-8 rounded object-cover border border-brand-500/30" />
                              <span className="text-xs font-bold text-brand-400 truncate">Image Ready</span>
                              <CheckCircle2 size={14} className="text-brand-500 ml-auto" />
                            </div>
                          ) : (
                            <>
                              <Package size={16} className="text-slate-500" />
                              <span className="text-xs font-bold text-slate-500">Upload Image</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-end">
                      <button 
                        disabled={isAnalyzing}
                        className="w-full h-[50px] bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isAnalyzing ? <Loader2 className="animate-spin" /> : null}
                        {isAnalyzing ? 'Predicting...' : 'Predict (₹)'}
                      </button>
                    </div>
                  </form>
                </div>

                {analysisError && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-8 p-4 bg-red-900/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400"
                  >
                    <AlertCircle className="shrink-0" size={20} />
                    <p className="text-sm font-medium">{analysisError}</p>
                  </motion.div>
                )}

                {analysisResult && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "grid grid-cols-1 gap-8",
                      (productImage || analysisResult.productImageUrl) ? "lg:grid-cols-4" : "lg:grid-cols-3"
                    )}
                  >
                    {/* 0. Product Preview (Conditional or Fetched) */}
                    {(productImage || analysisResult.productImageUrl) && (
                      <div className="bg-[#1e293b] p-4 rounded-2xl border border-slate-800 shadow-sm flex flex-col">
                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
                          {productImage ? "Uploaded Image" : "Market Image"}
                        </h4>
                        <div className="flex-1 rounded-xl overflow-hidden border border-slate-800 bg-slate-900 flex items-center justify-center">
                          <img 
                            src={productImage || analysisResult.productImageUrl} 
                            alt="Product" 
                            className="max-w-full max-h-[200px] object-contain"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              const keyword = (analysisResult.fallbackKeyword || subCategory || category).toLowerCase().replace(/\s+/g, ',');
                              (e.target as HTMLImageElement).src = `https://loremflickr.com/800/800/${keyword},product`;
                            }}
                          />
                        </div>
                        <div className="mt-4 p-3 bg-slate-900 rounded-xl text-[10px] text-slate-400 leading-relaxed">
                          <p className="font-bold text-brand-400 mb-1">
                            {productImage ? "Visual Analysis Active:" : "Market Intelligence:"}
                          </p>
                          {productImage 
                            ? "AI is factoring visual attributes into demand and risk scores."
                            : "Fetched actual product image from market datasets for accuracy."}
                        </div>
                      </div>
                    )}

                    {/* 1. Demand Score & Predicted Volume */}
                    <div className="bg-[#1e293b] p-8 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-brand-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-widest">
                        AI Intelligence Layer
                      </div>
                      <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">1. Demand & Volume</h4>
                      <div className="flex flex-col items-center text-center">
                        <div className={cn(
                          "w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold mb-4 border-4",
                          analysisResult.demandScore === 'High' ? "bg-brand-900/20 border-brand-500 text-brand-400" :
                          analysisResult.demandScore === 'Medium' ? "bg-blue-900/20 border-blue-500/50 text-blue-400" :
                          "bg-slate-900 border-slate-700 text-slate-400"
                        )}>
                          {analysisResult.demandScore}
                        </div>
                        <p className="text-lg font-semibold text-white mb-2">Demand Probability</p>
                        <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden mb-4">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.round(analysisResult.demandProbability)}%` }}
                            className={cn(
                              "h-full",
                              analysisResult.demandScore === 'High' ? "bg-brand-500" : "bg-blue-500"
                            )}
                          />
                        </div>
                        <div className="mt-4 p-4 bg-slate-900 rounded-xl w-full border border-slate-800">
                          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Predicted Sales Count</p>
                          <p className="text-2xl font-serif italic text-white">{analysisResult.predictedSalesCount.toLocaleString()} <span className="text-xs font-sans not-italic text-slate-400">units/mo</span></p>
                        </div>
                      </div>
                    </div>

                    {/* 2. Smart Pricing Suggestion */}
                    <div className="bg-[#1e293b] p-8 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-brand-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-widest">
                        AI Intelligence Layer
                      </div>
                      <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">2. Smart Pricing</h4>
                      <div className="space-y-6">
                        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                          <p className="text-xs font-bold text-slate-500 uppercase mb-2">Optimal Selling Price</p>
                          <p className="text-4xl font-serif italic text-white">
                            {analysisResult.pricingSuggestion.currency} {Math.round(analysisResult.pricingSuggestion.optimalPrice)}
                          </p>
                        </div>
                        <div className="bg-brand-900/20 p-6 rounded-2xl border border-brand-500/20">
                          <p className="text-xs font-bold text-brand-400 uppercase mb-2">Expected Profit Margin</p>
                          <p className="text-4xl font-serif italic text-brand-400">
                            {Math.round(analysisResult.pricingSuggestion.expectedProfitMargin)}%
                          </p>
                        </div>
                        <p className="text-sm text-slate-400 italic text-center">Calculated using regression model</p>
                      </div>
                    </div>

                    {/* 3. Risk Prediction */}
                    <div className="bg-[#1e293b] p-8 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-brand-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-widest">
                        AI Intelligence Layer
                      </div>
                      <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">3. Risk Prediction</h4>
                      <div className="space-y-8">
                        <div>
                          <div className="flex justify-between text-sm font-bold mb-2">
                            <span className="text-slate-300">Low Sales Probability</span>
                            <span className="text-orange-400">{Math.round(analysisResult.riskPrediction.lowSalesProbability)}%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.round(analysisResult.riskPrediction.lowSalesProbability)}%` }}
                              className="h-full bg-orange-500"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm font-bold mb-2">
                            <span className="text-slate-300">High Return Rate Prob.</span>
                            <span className="text-red-400">{Math.round(analysisResult.riskPrediction.highReturnProbability)}%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.round(analysisResult.riskPrediction.highReturnProbability)}%` }}
                              className="h-full bg-red-500"
                            />
                          </div>
                        </div>
                        <div className="p-4 bg-slate-900 rounded-xl text-white text-xs leading-relaxed">
                          <p className="font-bold text-brand-400 mb-1">Classification Insight:</p>
                          <span className="text-slate-300">{analysisResult.marketInsights}</span>
                        </div>
                      </div>
                    </div>

                    {/* 4. Historical Context (Full Width) */}
                    <div className="lg:col-span-full bg-[#1e293b] p-8 rounded-2xl border border-slate-800 shadow-sm">
                      <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Historical Context & Model Logic</h4>
                      <p className="text-slate-300 leading-relaxed italic">
                        {analysisResult.historicalContext}
                      </p>
                    </div>

                    {/* 5. Related Market Products Discovery */}
                    <div className="lg:col-span-full bg-[#1e293b] p-8 rounded-3xl border border-slate-800 shadow-sm relative overflow-hidden">
                      <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl" />
                      <div className="flex items-center justify-between mb-8 relative z-10">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-brand-500/10 rounded-xl border border-brand-500/20">
                            <Package className="text-brand-400" size={20} />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-white">Market Alternatives & Discovery</h4>
                            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Based on {category} • {subCategory}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            setCatalogCategory(category);
                            setCatalogSearchQuery(subCategory);
                            setActiveTab('catalog');
                          }}
                          className="text-xs font-bold text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1 group"
                        >
                          View Full Catalog <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                        {PRODUCT_CATALOG.filter(p => 
                          p.category === category && p.name !== subCategory
                        ).sort((a, b) => {
                          const targetSub = subCategory.toLowerCase();
                          const aName = a.name.toLowerCase();
                          const bName = b.name.toLowerCase();
                          const aSub = a.subCategory.toLowerCase();
                          const bSub = b.subCategory.toLowerCase();
                          
                          const aNameMatch = aName.includes(targetSub);
                          const bNameMatch = bName.includes(targetSub);
                          if (aNameMatch && !bNameMatch) return -1;
                          if (!aNameMatch && bNameMatch) return 1;
                          
                          const aSubMatch = aSub.includes(targetSub) || targetSub.includes(aSub);
                          const bSubMatch = bSub.includes(targetSub) || targetSub.includes(bSub);
                          if (aSubMatch && !bSubMatch) return -1;
                          if (!aSubMatch && bSubMatch) return 1;
                          
                          return 0;
                        }).slice(0, 8).map(related => (
                          <motion.div 
                            key={related.id}
                            whileHover={{ y: -5 }}
                            onClick={() => setSelectedProduct(related)}
                            className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800 hover:border-brand-500/30 transition-all cursor-pointer group"
                          >
                            <div className="aspect-square rounded-xl overflow-hidden bg-slate-800 mb-4 relative">
                              <img 
                                src={related.image} 
                                alt={related.name} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                <span className="text-[10px] font-bold text-white flex items-center gap-1">
                                  View Details <ChevronRight size={10} />
                                </span>
                              </div>
                            </div>
                            <h5 className="text-sm font-bold text-white truncate mb-1 group-hover:text-brand-400 transition-colors">{related.name}</h5>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{related.subCategory}</span>
                              <span className="text-sm font-bold text-brand-400">₹{related.baseCost.toLocaleString()}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {activeTab === 'trends' && (
              <motion.div 
                key="trends"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-serif italic text-white">Hot Market Trends</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Electronics', 'Fashion', 'Home', 'Beauty', 'Toys', 'Kitchen', 'Fitness'].map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={cn(
                          "px-4 py-2 rounded-full text-sm font-medium transition-all",
                          category === cat ? "bg-brand-500 text-white" : "bg-[#1e293b] text-slate-300 border border-slate-800 hover:border-slate-700"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {isLoadingTrends ? (
                  <div className="h-64 flex flex-col items-center justify-center text-slate-500 gap-4">
                    <Loader2 className="animate-spin" size={40} />
                    <p className="font-medium">Fetching real-time market data...</p>
                  </div>
                ) : trendsError ? (
                  <div className="h-64 flex flex-col items-center justify-center text-red-400 gap-4 bg-red-900/10 border border-red-500/20 rounded-2xl">
                    <AlertCircle size={40} />
                    <p className="font-medium">{trendsError}</p>
                    <button 
                      onClick={fetchTrends}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-xl text-xs font-bold transition-all"
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trendingProducts.map((item, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => {
                          const existing = PRODUCT_CATALOG.find(p => p.name.toLowerCase() === item.product.toLowerCase());
                          if (existing) {
                            setSelectedProduct(existing);
                          } else {
                            setSelectedProduct({
                              id: `trend-${i}`,
                              name: item.product,
                              category: item.category || category,
                              subCategory: item.product,
                              baseCost: 0,
                              image: item.imageUrl || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80`,
                              description: item.description || 'Trending market product identified by AI analysis.'
                            });
                          }
                        }}
                        className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-brand-400 font-bold text-lg">+{item.growth}%</span>
                        </div>
                        <h4 className="font-bold text-white text-lg mb-2">{item.product}</h4>
                        <div className="w-full aspect-video rounded-xl bg-slate-900 mb-4 overflow-hidden border border-slate-800">
                          <img 
                            src={item.imageUrl || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80`} 
                            alt={item.product} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              const keyword = (item.fallbackKeyword || item.product).toLowerCase().replace(/\s+/g, ',');
                              (e.target as HTMLImageElement).src = `https://loremflickr.com/800/450/${keyword},product`;
                            }}
                          />
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed mb-4">{item.reason}</p>
                        <button 
                          onClick={() => {
                            setActiveTab('analyze');
                          }}
                          className="text-brand-400 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all"
                        >
                          Predict for this category <ChevronRight size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'compare' && (
              <motion.div 
                key="compare"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-serif italic text-white">Product Comparison</h3>
                    <p className="text-sm text-slate-400">Compare market metrics across multiple products</p>
                  </div>
                  <button 
                    onClick={() => setCompareList([])}
                    className="text-xs font-bold text-red-400 hover:underline"
                  >
                    Clear All
                  </button>
                </div>

                {compareList.length === 0 ? (
                  <div className="h-96 flex flex-col items-center justify-center text-slate-500 gap-6 bg-[#1e293b] border border-slate-800 border-dashed rounded-3xl">
                    <div className="p-6 bg-slate-900 rounded-full">
                      <BarChart3 size={48} className="text-slate-700" />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-white mb-2">No products to compare</p>
                      <p className="text-sm max-w-xs mx-auto">Add products from the catalog to compare their market performance side-by-side.</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('catalog')}
                      className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-500/20"
                    >
                      Browse Catalog
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {compareList.map(product => (
                      <div key={product.id} className="bg-[#1e293b] rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
                        <div className="aspect-video bg-slate-900 relative">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          <button 
                            onClick={() => setCompareList(prev => prev.filter(p => p.id !== product.id))}
                            className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <div className="p-6 space-y-4">
                          <h4 className="font-bold text-white truncate">{product.name}</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Cost Price</p>
                              <p className="text-lg font-bold text-white">₹{product.baseCost.toLocaleString()}</p>
                            </div>
                            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Category</p>
                              <p className="text-lg font-bold text-white truncate">{product.category}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              setCategory(product.category);
                              setSubCategory(product.name);
                              setCostPrice(product.baseCost.toString());
                              setActiveTab('analyze');
                            }}
                            className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl transition-all"
                          >
                            Analyze Market
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {selectedProduct && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedProduct(null)}
                  className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="relative w-full max-w-4xl bg-[#111827] border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row"
                >
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-all"
                  >
                    <X size={20} />
                  </button>

                  <div className="w-full md:w-1/2 aspect-square md:aspect-auto relative bg-slate-900">
                    <img 
                      src={selectedProduct.image} 
                      alt={selectedProduct.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent md:hidden" />
                  </div>

                  <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col overflow-y-auto max-h-[90vh] md:max-h-none">
                    <div className="mb-8">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-brand-500/20 border border-brand-500/30 rounded-full text-[10px] font-bold text-brand-400 uppercase tracking-widest">
                          {selectedProduct.category}
                        </span>
                        <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {selectedProduct.subCategory}
                        </span>
                      </div>
                      <h2 className="text-3xl font-serif italic text-white mb-2">{selectedProduct.name}</h2>
                      <div className="flex items-center gap-4 mb-6">
                        <span className="text-2xl font-bold text-brand-400">₹{selectedProduct.baseCost.toLocaleString()}</span>
                        <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/10 rounded-lg">
                          <Star size={14} className="text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-bold text-yellow-500">4.8</span>
                        </div>
                      </div>
                      <p className="text-slate-400 leading-relaxed">
                        {selectedProduct.description}
                      </p>
                    </div>

                    <div className="mt-auto space-y-6">
                      {/* Related Products Section */}
                      <div className="border-t border-slate-800 pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Package size={14} className="text-slate-500" />
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Related Products</h4>
                          </div>
                          <button 
                            onClick={() => {
                              setCatalogCategory(selectedProduct.category);
                              setCatalogSearchQuery(selectedProduct.subCategory);
                              setSelectedProduct(null);
                              setActiveTab('catalog');
                            }}
                            className="text-[9px] font-bold text-brand-400 uppercase tracking-widest hover:underline"
                          >
                            View All
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {PRODUCT_CATALOG.filter(p => 
                            p.id !== selectedProduct.id && 
                            p.category === selectedProduct.category
                          ).sort((a, b) => {
                            const targetSub = selectedProduct.subCategory.toLowerCase();
                            const targetName = selectedProduct.name.toLowerCase();
                            const aSub = a.subCategory.toLowerCase();
                            const bSub = b.subCategory.toLowerCase();
                            const aName = a.name.toLowerCase();
                            const bName = b.name.toLowerCase();

                            if (aSub === targetSub && bSub !== targetSub) return -1;
                            if (aSub !== targetSub && bSub === targetSub) return 1;

                            const aMatch = aName.includes(targetSub) || targetName.includes(aSub);
                            const bMatch = bName.includes(targetSub) || targetName.includes(bSub);
                            if (aMatch && !bMatch) return -1;
                            if (!aMatch && bMatch) return 1;

                            return 0;
                          }).slice(0, 4).map(related => (
                            <motion.div 
                              key={related.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedProduct(related);
                              }}
                              className="flex items-center gap-3 p-2 bg-slate-900/50 rounded-xl border border-slate-800 hover:border-brand-500/30 transition-all cursor-pointer group"
                            >
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                                <img 
                                  src={related.image} 
                                  alt={related.name} 
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[10px] font-bold text-white truncate group-hover:text-brand-400 transition-colors">{related.name}</p>
                                <p className="text-[9px] text-slate-500 truncate">{related.subCategory}</p>
                                <p className="text-[9px] font-bold text-brand-400 mt-0.5">₹{related.baseCost.toLocaleString()}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => {
                            toggleWishlist(selectedProduct.id);
                          }}
                          className={cn(
                            "flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all border",
                            wishlist.includes(selectedProduct.id)
                              ? "bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20"
                              : "bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                          )}
                        >
                          <Heart size={20} className={wishlist.includes(selectedProduct.id) ? "fill-current" : ""} />
                          {wishlist.includes(selectedProduct.id) ? "Saved" : "Save"}
                        </button>
                        <button 
                          onClick={() => {
                            setCategory(selectedProduct.category);
                            setSubCategory(selectedProduct.name);
                            setCostPrice(selectedProduct.baseCost.toString());
                            setSelectedProduct(null);
                            setActiveTab('analyze');
                          }}
                          className="flex items-center justify-center gap-2 py-4 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-brand-500/20"
                        >
                          <TrendingUp size={20} />
                          Analyze
                        </button>
                      </div>
                      <p className="text-[10px] text-center text-slate-500 uppercase tracking-widest font-bold">
                        Market data updated 2 mins ago
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ label, active, onClick }: { label: string, active?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all",
        active 
          ? "bg-brand-900/20 text-brand-400 shadow-sm ring-1 ring-brand-500/30" 
          : "text-slate-400 hover:bg-slate-800 hover:text-white"
      )}
    >
      {label}
    </button>
  );
}

function StatCard({ title, value, subtitle, trend }: { title: string, value: string, subtitle: string, trend: string }) {
  return (
    <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className={cn(
          "text-xs font-bold px-2 py-1 rounded-full",
          trend.includes('+') ? "bg-brand-900/30 text-brand-400" : "bg-slate-800 text-slate-400"
        )}>
          {trend}
        </span>
      </div>
      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</h4>
      <p className="text-3xl font-serif italic text-white mb-1">{value}</p>
      <p className="text-xs text-slate-400">{subtitle}</p>
    </div>
  );
}

function InsightItem({ type, text }: { type: 'positive' | 'warning' | 'neutral', text: string }) {
  return (
    <div className={cn(
      "p-4 rounded-xl border flex gap-3 items-start",
      type === 'positive' ? "bg-brand-900/10 border-brand-500/20" :
      type === 'warning' ? "bg-orange-900/10 border-orange-500/20" :
      "bg-slate-800/50 border-slate-700"
    )}>
      <p className="text-sm text-slate-300 leading-snug">{text}</p>
    </div>
  );
}
