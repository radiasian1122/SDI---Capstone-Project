const express = require('express');
const router = express.Router();
const driversCtl = require('../controllers/drivers.js')


router.get('/', driversCtl.getAllDrivers)

router.get('/:quals', driversCtl.getAllQuals)

module.exports = router;