const { Schema, model } = require('mongoose');

const Accessory = new Schema({
    type: { type: String, required: true }, // watch, sunglasses, jewlery
    color: String,
    company: String,
    price: Number,
    gender: {
        type: String,
        enum: ['M', 'F'], // Restricts gender to 'M' or 'F'
        required: true
    },
    img: String, // URL or file path to the image
    stock: Number,
});

module.exports = model('Accessory', Accessory);
