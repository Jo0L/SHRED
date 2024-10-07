const express = require('express');
const router = express.Router();
const { addOrRemoveItem, isInWishlist, getWishlist } = require('../controllers/wishlist');

router.get('/getWishlist', getWishlist);

router.post('/addOrRemove', addOrRemoveItem);
router.post('/isInWishlist', isInWishlist);

module.exports = router;