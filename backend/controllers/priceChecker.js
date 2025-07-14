const axios = require("axios");
const nodemailer = require("nodemailer");
const StockUser = require("../models/alertPrice");
const dotenv = require("dotenv").config();
const API_BASE =
  process.env.NODE_ENV === "production"
    ? process.env.API_BASE_PROD
    : process.env.API_BASE_DEV;

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const checkStockPrices = async () => {
  try {
    const users = await StockUser.find(); // Fetch all users and their stock alerts

    for (const user of users) {
      let stocksToKeep = [];

      for (const stock of user.stock) {
        const response = await axios.get(`${API_BASE}/stock/${stock.stockId}`);
        const currentPrice = response.data.priceInfo.lastPrice;

        if (currentPrice >= stock.targetPrice) {
          await sendEmail(
            user.name,
            user.email,
            stock,
            "Target Price Reached",
            currentPrice,
          );
        } else if (currentPrice <= stock.stopLoss) {
          await sendEmail(
            user.name,
            user.email,
            stock,
            "Stop Loss Triggered",
            currentPrice,
          );
        } else {
          stocksToKeep.push(stock); // Keep the stock if neither condition is met
        }
      }
      user.stock = stocksToKeep;
      await StockUser.findByIdAndUpdate(user._id, { stock: stocksToKeep });
    }
  } catch (error) {
    console.error("Error checking stock prices:", error);
  }
};

const sendEmail = async (name, email, stock, subject, currentPrice) => {
  const mailOptions = {
    from: "your-email@gmail.com",
    to: email,
    subject: subject,
    text: `Hey ${name} 
    The stock ${stock.stockName} (${stock.stockId}) has reached the following condition:
    - Current Price: ₹${currentPrice}
    - Target Price: ₹${stock.targetPrice}
    - Stop Loss: ₹${stock.stopLoss}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email} for stock ${stock.stockName}`);
  } catch (error) {
    console.error(`Failed to send email to ${email}:`, error);
  }
};

const schedulePriceCheck = () => {
  console.log("Starting stock price check...");

  // Run the function every 10 minutes (600,000 milliseconds)
  setInterval(() => {
    console.log("Running stock price check...");
    checkStockPrices();
  }, 600000); // 10 minutes in milliseconds
};
module.exports = { schedulePriceCheck };
