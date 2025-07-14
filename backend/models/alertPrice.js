const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
stockId: {
    type: String,
    required: true,
    },
    stockName: {
        type: String,
        required: true,
    },
    targetPrice: {
        type: Number,
        required: true,
    },
    stopLoss: {
        type: Number,
        required: true,
    }
});
const stockUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    stock: [alertSchema]
})

module.exports = mongoose.model("StockUser", stockUserSchema);