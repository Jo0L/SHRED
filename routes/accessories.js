const express = require('express');
const router = express.Router();
const accessoryController = require('../controllers/accessories');

router.route('')
    .get(accessoryController.getAccessories);

router.route('/update-accessory')
    .patch(accessoryController.updateAccessory);

router.route('/delete/:id')
    .delete(accessoryController.deleteAccessory);

router.route('/filter')
    .get(accessoryController.filterAndSortAccessories);

router.route('/:type')
    .get(accessoryController.getAccessories)
    .post(accessoryController.getAccessory);
    
module.exports = router;
