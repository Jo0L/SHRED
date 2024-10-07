const Location = require('../models/location');

const getAllLocations = async () => {
    try {
        return await Location.find(); // Fetch all location documents from the database
    } catch (error) {
        console.error('Error fetching locations from the database:', error);
        throw error; // Propagate the error to the controller
    }
};

module.exports = {
    getAllLocations
};