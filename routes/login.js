const express = require('express');
const router = express.Router();
const controller = require('../controllers/login');


router.route('/register').post(controller.register);
router.route('/login').post(controller.login);
router.route('/logout').get(controller.logout);

// Forgot password routes
router.route('/forgot-password').post(controller.forgotPassword);
router.route('/reset-password/:token').get(controller.resetPassword);
router.route('/reset-password/:token').post(controller.resetPassword);

module.exports = router;