const { Schema, model } = require('mongoose');

const Order = new Schema({
    _id: Object,
    user: { type: String, required: true },
    date: { type: Date, required: true },
    price: { type: Number, required: true },
    items: { type: Array, required: true },
});

module.exports = model('orders', Order);
