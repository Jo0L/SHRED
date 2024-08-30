const express = require('express');
const router = express.Router();
const accessoryController = require('../controllers/accessories');

router.route('/').get(accessoryController.getAccessories)

router.route('').patch(accessoryController.updateAccessory)

// Watches / Jewlery / Sunglasses
router.route('/:type')
    .get(accessoryController.getAccessories)
    .post(accessoryController.getAccessory);
    
router.route('/:type/:id')
    .get(accessoryController.getAccessory)
    .patch(accessoryController.updateAccessory)
    .delete(accessoryController.deleteAccessory);


module.exports = router;