const { Schema, model, models } = require('mongoose');

// Check if the model already exists before defining it
const LocationSchema = new Schema({
    name: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    description: { type: String, required: true }
});

module.exports = models.locations || model('locations', LocationSchema);