const express = require('express');
const router = express.Router();
const { getCart, addToCart, adjustQuantity, deleteItem, clearCart } = require('../controllers/cart');

router.route('/').get(getCart)

router.post('/add', addToCart);
router.post('/adjustQuantity', adjustQuantity);
router.post('/removeItem', deleteItem);

router.post('/clearCart', clearCart);

module.exports = router;
