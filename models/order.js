const { Schema, model } = require('mongoose');

const Order = new Schema({
    user: { type: String, required: true },
    date: { type: Date, required: true },
    price: { type: Number, required: true },
    amount: { type: Number, required: true },
    items: { type: Array, required: true },
    paymentData: { type: Array, required: true },
    status: { type: String, enum: ['Delivered', 'Processing'], required: true }
});

module.exports = model('orders', Order);
