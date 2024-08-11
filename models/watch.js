const { Schema, model } = require('mongoose');

const Watch = new Schema({
    type: { type: String, required: true },
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

module.exports = model('Watch', Watch);
