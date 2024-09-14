const { Schema, model } = require('mongoose');

const Accessory = new Schema({
    type: { type: String, enum: ['watches', 'sunglasses', 'jewelry'], required: true },
    color: { type: String, required: true },
    company: { type: String, required: true },
    price: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    img: { type: String, required: true },
    stock: { type: Number, required: true },
});

module.exports = model('Accessory', Accessory);
