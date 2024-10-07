const locationService = require('../services/location');

const getLocationPage = async (req, res) => {
    try {
        const locations = await locationService.getAllLocations();
        
        if(locations) {
            res.status(200).json({ locations: locations, apiKey: process.env.GOOGLE_MAPS_API_KEY });
        }
        else {
            res.status(500).send('Error fetching location data');
        }
    } catch (error) {
        console.error('Error fetching location data:', error); // Log the error for debugging
        res.status(500).send('Error fetching location data');
    }
};

module.exports = {
    getLocationPage
};