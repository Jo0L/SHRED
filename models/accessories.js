const { Schema, model } = require('mongoose');

const Accessory = new Schema({
    type: { type: String, enum: ['watches', 'sunglasses', 'jewelry'], required: true },
    color: String,
    company: String,
    price: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    img: String, // URL or file path to the image
    stock: Number,
});

module.exports = model('Accessory', Accessory);
