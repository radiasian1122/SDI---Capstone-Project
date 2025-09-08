const express = require('express')
const router = express.Router()
const vehicleCtl = require('../controllers/vehicle.js')

router.get('/:id', vehicleCtl.getVehicleById)

router.post('/:id', vehicleCtl.addNewVehicle)

module.exports = router