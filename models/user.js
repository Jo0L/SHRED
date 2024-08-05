const { Schema, model } = require('mongoose');

const User = new Schema({
    _id: String, // mail & username
    password: { type: String, required: true },
    firstName: String,
    lastName: String,
    gender: String, // TODO: Decide if to keep this as "M" | "F"
});

module.exports = model('users', User);
