const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders');

router.route('').get(ordersController.getMyOrders)

// Create order
router.post('', ordersController.createOrder);


module.exports = router;