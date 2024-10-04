const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment'); // Adjust the path as needed

// Existing route to get payment details
router.get('/payment', paymentController.getPaymentDetails);

// New route to handle payment confirmation
router.post('/confirm-payment', paymentController.confirmPayment);

module.exports = router;
