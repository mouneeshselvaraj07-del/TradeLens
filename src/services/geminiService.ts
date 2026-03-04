import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface MarketAnalysis {
  demandScore: "High" | "Medium" | "Low";
  demandProbability: number; // 0-100
  predictedSalesCount: number; // Estimated units per month
  pricingSuggestion: {
    optimalPrice: number;
    expectedProfitMargin: number; // percentage
    currency: string;
  };
  riskPrediction: {
    lowSalesProbability: number; // 0-100
    highReturnProbability: number; // 0-100
  };
  marketInsights: string;
  historicalContext: string;
  productImageUrl?: string;
  fallbackKeyword?: string;
}

export const analyzeProduct = async (
  category: string, 
  subCategory: string,
  location: string, 
  month: string, 
  costPrice: number,
  image?: string | null
): Promise<MarketAnalysis> => {
  const parts: any[] = [
    {
      text: `Act as a senior market data scientist. Your analysis must be grounded in real-time trends and patterns found in global e-commerce public datasets. 
    
    Predict market performance for:
    Category: ${category}
    Sub-Category: ${subCategory}
    Location: ${location}
    Month: ${month}
    Cost Price: ${costPrice} (in Rupees ₹)
    ${image ? "An image of the product has been provided for visual context." : ""}
    
    Provide:
    1. Demand Score (High/Medium/Low) based on historical sales velocity.
    2. Predicted Sales Count (Estimated units sold per month for a typical seller in this category/location).
    3. Smart Pricing Suggestion (Optimal selling price and profit margin) using regression patterns from e-commerce datasets. Use Rupees (₹) as the currency.
    4. Risk Prediction (Probability of low sales and high return rate) using classification logic derived from e-commerce return data.
    5. A REAL, DIRECT image URL (ending in .jpg, .png, or .webp) of the actual product from a reliable public source like Amazon.in, Flipkart, or official brand sites.
    6. A specific 'fallbackKeyword' which is a broader category term (e.g., "smartphone", "laptop", "sneakers") to ensure fallback images are at least category-relevant.
    
    IMPORTANT: Use the googleSearch tool to find ACTUAL product images. DO NOT use placeholder URLs like example.com or picsum.photos.
    
    All probabilities and percentages must be whole numbers between 0 and 100 (e.g., 44 instead of 0.44).
    
    Return the data in the specified JSON format. If you cannot find a specific image, provide a high-quality category-relevant image URL.`
    }
  ];

  if (image) {
    const base64Data = image.split(',')[1];
    const mimeType = image.split(';')[0].split(':')[1];
    parts.push({
      inlineData: {
        data: base64Data,
        mimeType: mimeType
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts },
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            demandScore: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
            demandProbability: { type: Type.NUMBER },
            predictedSalesCount: { type: Type.NUMBER },
            pricingSuggestion: {
              type: Type.OBJECT,
              properties: {
                optimalPrice: { type: Type.NUMBER },
                expectedProfitMargin: { type: Type.NUMBER },
                currency: { type: Type.STRING }
              },
              required: ["optimalPrice", "expectedProfitMargin", "currency"]
            },
            riskPrediction: {
              type: Type.OBJECT,
              properties: {
                lowSalesProbability: { type: Type.NUMBER },
                highReturnProbability: { type: Type.NUMBER }
              },
              required: ["lowSalesProbability", "highReturnProbability"]
            },
            marketInsights: { type: Type.STRING },
            historicalContext: { type: Type.STRING },
            productImageUrl: { type: Type.STRING },
            fallbackKeyword: { type: Type.STRING }
          },
          required: ["demandScore", "demandProbability", "predictedSalesCount", "pricingSuggestion", "riskPrediction", "marketInsights", "historicalContext", "productImageUrl", "fallbackKeyword"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini analyzeProduct error (with search):", error);
    
    // Fallback: Try without googleSearch if the first attempt fails
    try {
      const fallbackResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: { parts },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              demandScore: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
              demandProbability: { type: Type.NUMBER },
              predictedSalesCount: { type: Type.NUMBER },
              pricingSuggestion: {
                type: Type.OBJECT,
                properties: {
                  optimalPrice: { type: Type.NUMBER },
                  expectedProfitMargin: { type: Type.NUMBER },
                  currency: { type: Type.STRING }
                },
                required: ["optimalPrice", "expectedProfitMargin", "currency"]
              },
              riskPrediction: {
                type: Type.OBJECT,
                properties: {
                  lowSalesProbability: { type: Type.NUMBER },
                  highReturnProbability: { type: Type.NUMBER }
                },
                required: ["lowSalesProbability", "highReturnProbability"]
              },
              marketInsights: { type: Type.STRING },
              historicalContext: { type: Type.STRING },
              productImageUrl: { type: Type.STRING },
              fallbackKeyword: { type: Type.STRING }
            },
            required: ["demandScore", "demandProbability", "predictedSalesCount", "pricingSuggestion", "riskPrediction", "marketInsights", "historicalContext", "productImageUrl", "fallbackKeyword"]
          }
        }
      });
      return JSON.parse(fallbackResponse.text || "{}");
    } catch (fallbackError) {
      console.error("Gemini analyzeProduct error (fallback):", fallbackError);
      throw fallbackError;
    }
  }
};

export const getMarketTrends = async (category: string): Promise<any> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide REAL-TIME market trends for the ${category} category in India as of March 2026. 
      Include 10 highly specific trending products with their growth percentage and a detailed reason why they are trending right now.
      
      IMPORTANT: Use the googleSearch tool to find ACTUAL, high-quality product image URLs from reputable sources like Amazon.in, Flipkart, or official brand websites.
      
      For each product, provide:
      1. Product name (specific model)
      2. Growth percentage (whole number)
      3. Reason for trend
      4. A REAL, DIRECT image URL (ending in .jpg, .png, or .webp). DO NOT use placeholder URLs like example.com or picsum.photos.
      5. A 'fallbackKeyword' which is a broader category term (e.g., "smartphone", "laptop", "sneakers") to ensure fallback images are at least category-relevant.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              product: { type: Type.STRING },
              growth: { type: Type.NUMBER },
              reason: { type: Type.STRING },
              imageUrl: { type: Type.STRING },
              fallbackKeyword: { type: Type.STRING }
            },
            required: ["product", "growth", "reason", "imageUrl", "fallbackKeyword"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini getMarketTrends error (with search):", error);
    
    // Fallback: Try without googleSearch
    try {
      const fallbackResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Provide REAL-TIME market trends for the ${category} category in India as of March 2026. 
        Include 10 highly specific trending products with their growth percentage and a detailed reason why they are trending right now.
        
        For each product, provide:
        1. Product name (specific model)
        2. Growth percentage (whole number)
        3. Reason for trend
        4. A high-quality placeholder image URL from Unsplash (e.g., https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80)
        5. A 'fallbackKeyword' which is a broader category term (e.g., "smartphone", "laptop", "sneakers").`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                product: { type: Type.STRING },
                growth: { type: Type.NUMBER },
                reason: { type: Type.STRING },
                imageUrl: { type: Type.STRING },
                fallbackKeyword: { type: Type.STRING }
              },
              required: ["product", "growth", "reason", "imageUrl", "fallbackKeyword"]
            }
          }
        }
      });
      return JSON.parse(fallbackResponse.text || "[]");
    } catch (fallbackError) {
      console.error("Gemini getMarketTrends error (fallback):", fallbackError);
      return []; // Return empty array instead of throwing to prevent UI crash
    }
  }
};

