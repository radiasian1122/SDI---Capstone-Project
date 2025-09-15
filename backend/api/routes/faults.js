const express = require('express')
const router = express.Router()
const faultsCtl = require('../controllers/faults.js')

router.get('/', faultsCtl.getAllFaults)

router.get('/:vehicle_id', faultsCtl.getFaultsByVehicleId)

module.exports = router