const express = require('express');
const router = express.Router();
//const ordersController = require('../controllers/orders');
const accessoryController = require('../controllers/accessories');

router.route('').get((req, res) => res.render('manager', {username: req.session.username, isAdmin: req.session.isAdmin}));
router.route('/products').get(accessoryController.getAllProducts)
router.route('/add-accessory').post(accessoryController.createAccessory)


//router.route('/users').get(accessoryController.getAllProducts)

module.exports = router;