const express = require("express");
const {
  getStockPrice,
  setStockLimit,
  getHistory,
  getAlertsByEmail,
  aiPredict,
} = require("../controllers/stockController");
const router = express.Router();

router.get("/:id", getStockPrice);
router.post("/alert", setStockLimit);
router.get("/alert/:email", getAlertsByEmail);
router.get("/graph/:symbol", getHistory);
router.post("/ai/predict", aiPredict);

module.exports = router;
