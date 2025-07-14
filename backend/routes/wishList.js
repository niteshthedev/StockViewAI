const express = require("express");
const router = express.Router();
const WishList = require("../models/wishList");

router.post("/", async (req, res) => {
  const { email, stock } = req.body;
  if (!email || !stock || !stock.stockId || !stock.stockName) {
    return res.status(400).json({ message: "Invalid request data" });
  }

  try {
    const exists = await WishList.findOne({
      userId: email,
      stockId: stock.stockId,
    });
    if (exists) {
      return res.status(200).json({ message: "Already in wishlist" });
    }

    const newEntry = new WishList({
      userId: email,
      stockId: stock.stockId,
      stockName: stock.stockName,
    });

    await newEntry.save();
    res.status(201).json({ message: "Added to wishlist" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get wishlist by user
router.get("/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const items = await WishList.find({ userId: email });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Remove a stock from wishlist
router.delete("/:email/:stockId", async (req, res) => {
  const { email, stockId } = req.params;
  try {
    await WishList.deleteOne({ userId: email, stockId });
    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
