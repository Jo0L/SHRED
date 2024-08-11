const express = require('express');
const router = express.Router();
const watchCntroller = require('../controllers/watch');


router.route('/')
    .get(watchCntroller.getWatches)
    .post(watchCntroller.createWatch);
router.route('/:id')
    .get(watchCntroller.getWatch)
    .patch(watchCntroller.updateWatch)
    .delete(watchCntroller.deleteWatch);

module.exports = router;