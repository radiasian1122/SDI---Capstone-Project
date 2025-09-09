const express = require('express')
const router = express.Router()
const vehiclesCtl = require('../controllers/vehicles.js')

router.get('/', vehiclesCtl.getAllVehicles)
router.get('/:id', vehiclesCtl.getVehicleById)

module.exports = router