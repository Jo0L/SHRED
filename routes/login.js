const express = require('express');
const router = express.Router();
const controller = require('../controllers/login');


router.route('/register')
    .post(controller.register);
router.route('/login')
    .post(controller.login);
router.route('/logout').get(controller.logout);

module.exports = router;