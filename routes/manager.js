const express = require('express');
const router = express.Router();
//const ordersController = require('../controllers/orders');
const accessoryController = require('../controllers/accessories');
const userController = require('../controllers/users');


router.route('').get((req, res) => res.render('manager', {username: req.session.username, isAdmin: req.session.isAdmin}));
router.route('/products').get(accessoryController.getAllProducts)
router.route('/add-accessory').post(accessoryController.createAccessory)

router.route('/users').get(userController.getAllUsers)
router.route('/user-delete/:id').delete(userController.deleteUser)

router.route('/users/updateAdmin/:id').patch(userController.changeAdmin)

//router.route('/users').get(accessoryController.getAllProducts)

module.exports = router;