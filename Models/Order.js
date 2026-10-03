const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    total: { type: Number, required: true }
});

module.exports = mongoose.model("Order", orderSchema);