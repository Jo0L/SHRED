const express = require('express');
const router = express.Router();
const locationController = require('../controllers/location');

router.route('/getLocation').get(locationController.getLocationPage);

module.exports=router;