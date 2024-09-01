const { Schema, model } = require('mongoose');

const User = new Schema({
    _id: String, // mail & username
    password: { type: String, required: true },
    firstName: String,
    lastName: String,
    gender: String, // TODO: Decide if to keep this as "M" | "F"
    address: String,
    mail: String,
    whishlist: Array,
    isAdmin: Boolean,
    cart: [
        {
            accessoryId: String,
            quantity: Number,
            price: Number,
            title: String,
            img: String,
            addedAt: Date
        }
    ]
});

module.exports = model('users', User);
