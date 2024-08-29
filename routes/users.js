const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

router.route('').get(usersController.getMyUser)
router.route('').patch(usersController.updateUser)

module.exports = router;