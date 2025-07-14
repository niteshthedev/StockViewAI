const mongoose = require("mongoose");
const wishListSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  stockId: {
    type: String,
    required: true,
  },
  stockName: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("WishList", wishListSchema);
