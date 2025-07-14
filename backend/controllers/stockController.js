process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const { NseIndia } = require("stock-nse-india");
const axios = require("axios");
const StockUser = require("../models/alertPrice");

const nseIndia = new NseIndia();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const headers = { "Content-Type": "application/json" };

const systemPrompt = `You are an AI financial advisor. For a given stock JSON object, respond with these 6 keys in plain JSON:
- pros: array of key strengths
- cons: array of key weaknesses
- recommendation: one of [buy, sell, hold]
- bestBuyPrice: ideal price to buy taking the current market price into account
- bestSellPrice: ideal price to sell taking the current market price into account
- summary: short human-friendly company overview.
Be honest. Do not include explanation or markdown. Response should be valid JSON. Short and simple responses are preferred. Taking current market price into account is important for buy/sell recommendations.`;

const baseHistory = [
  {
    role: "user",
    parts: [{ text: systemPrompt }],
  },
  {
    role: "model",
    parts: [
      { text: "Understood. I will return only the 6-key JSON as requested." },
    ],
  },
];

const getStockPrice = async (req, res) => {
  const stockID = req.params.id;
  if (!stockID)
    return res.status(400).json({ message: "Stock ID is required" });

  try {
    const details = await nseIndia.getEquityDetails(stockID);
    if (details?.priceInfo?.lastPrice !== undefined) {
      return res.status(200).json(details);
    } else {
      return res.status(404).json({ message: "Stock details not found" });
    }
  } catch (error) {
    console.error("Error fetching stock price: ", error);
    res.status(500).json({ message: "Error fetching stock price" });
  }
};

const setStockLimit = async (req, res) => {
  const { name, email, stock } = req.body;
  if (!name || !email || !stock)
    return res.status(400).json({ message: "All fields are required!" });

  try {
    let user = await StockUser.findOne({ email });
    if (!user) user = new StockUser({ name, email, stock: [] });

    const existingStock = user.stock.find((s) => s.stockId === stock.stockId);
    if (existingStock) {
      existingStock.targetPrice = stock.targetPrice;
      existingStock.stopLoss = stock.stopLoss;
    } else {
      user.stock.push(stock);
    }

    await user.save();

    res.status(200).json({
      message: existingStock
        ? "Price Limits Update Successfully"
        : "Price Limits Set Successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data", error });
  }
};

const getAlertsByEmail = async (req, res) => {
  const { email } = req.params;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const alerts = await StockUser.find({ email });
    res.status(200).json(alerts);
  } catch (error) {
    console.error("Error fetching alerts: ", error);
    res.status(500).json({ message: "Failed to fetch alerts" });
  }
};

const getHistory = async (req, res) => {
  const symbol = req.params.symbol;
  try {
    const rawResult = await nseIndia.getEquityHistoricalData(symbol);
    const allData = [];

    rawResult.forEach((segment) => {
      if (segment.data && Array.isArray(segment.data)) {
        segment.data.forEach((d) => {
          allData.push({
            time: Math.floor(new Date(d.CH_TIMESTAMP).getTime() / 1000),
            open: d.CH_OPENING_PRICE,
            high: d.CH_TRADE_HIGH_PRICE,
            low: d.CH_TRADE_LOW_PRICE,
            close: d.CH_CLOSING_PRICE,
          });
        });
      }
    });

    allData.sort((a, b) => a.time - b.time);

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(allData);
  } catch (error) {
    console.error("Error fetching historical data:", error.message);
    res.status(500).json({ error: "Failed to fetch historical data" });
  }
};

const aiPredict = async (req, res) => {
  const input = req.body;

  const stock = {
    name: input["Issuer Name"] || input["Security Name"],
  };

  const history = [
    {
      role: "user",
      parts: [
        {
          text: `You are an AI financial advisor. Given the following stock data, respond in raw JSON (no markdown or explanation) with: fetch the data from https://www.chittorgarh.com/  website 

{
  pros: [...],
  cons: [...],
  recommendation: "buy" | "sell" | "hold",
  bestBuyPrice: number,
  bestSellPrice: number,
  summary: "short human-friendly company summary"
}
    
    Input:`,
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: "Understood. Waiting for the stock object.",
        },
      ],
    },
    {
      role: "user",
      parts: [
        {
          text: JSON.stringify(stock),
        },
      ],
    },
  ];

  const body = {
    contents: history,
    generationConfig: { temperature: 0.7 },
  };

  try {
    const response = await axios.post(GEMINI_URL, body, { headers });
    const text = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text)
      return res
        .status(500)
        .json({ error: "No content received from Gemini AI." });

    const cleaned = text
      .trim()
      .replace(/^```json|```$/g, "")
      .trim();
    const parsed = JSON.parse(cleaned);

    parsed.bestBuyPrice = Number(parseFloat(parsed.bestBuyPrice).toFixed(2));
    parsed.bestSellPrice = Number(parseFloat(parsed.bestSellPrice).toFixed(2));

    return res.json(parsed);
  } catch (err) {
    console.error("AI Predict Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to get prediction from Gemini AI" });
  }
};

module.exports = {
  getStockPrice,
  setStockLimit,
  getAlertsByEmail,
  getHistory,
  aiPredict,
};
