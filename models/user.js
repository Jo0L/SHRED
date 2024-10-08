const { Schema, model } = require('mongoose');

const User = new Schema({
    _id: String, // mail 
    password: { type: String, required: true },
    firstName: String,
    lastName: String,
    gender: { type: String, enum: ['Male', 'Female', 'Rather not say'], required: true },
    address: String,
    wishlist: Array,
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
    ],
    resetPasswordToken: String, // Token to reset the password
    resetPasswordExpires: Date // Token expiration time
});

module.exports = model('users', User);
