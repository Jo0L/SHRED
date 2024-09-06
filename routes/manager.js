const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders');
const accessoryController = require('../controllers/accessories');
const userController = require('../controllers/users');

// for products
router.route('').get((req, res) => res.render('manager', {username: req.session.username, isAdmin: req.session.isAdmin}));
router.route('/products').get(accessoryController.getAllProducts)
router.route('/add-accessory').post(accessoryController.createAccessory)

// for users
router.route('/users').get(userController.getAllUsers)
router.route('/user-delete/:id').delete(userController.deleteUser)
router.route('/users/updateAdmin/:id').patch(userController.changeAdmin)

// for orders
router.route('/orders').get(ordersController.getAllOrders)
router.route('/order-cancel/:id').delete(ordersController.cancelOrder)
router.route('/order-deliver/:id').patch(ordersController.updateOrderStatus)

// for statistics
router.route('/api/orders-stats').get(ordersController.getAllOrdersStats);
router.route('/statistics').get(ordersController.renderStatsPage);



module.exports = router;