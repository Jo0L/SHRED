const express = require('express');
const router = express.Router();
const accessoryController = require('../controllers/accessories');

// All
router.route('/')
    .get(accessoryController.getAccessories)

// Route to handle filtering and sorting
router.route('/filter')
    .get(accessoryController.filterAndSortAccessories);

// Watches / Jewlery / Sunglasses
router.route('/:type')
    .get(accessoryController.getAccessories)
    .post(accessoryController.getAccessory);
router.route('/:type/:id')
    .get(accessoryController.getAccessory)
    .patch(accessoryController.updateAccessory)
    .delete(accessoryController.deleteAccessory);


module.exports = router;