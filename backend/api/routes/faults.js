const express = require('express')
const router = express.Router()
const faultsCtl = require('../controllers/faults.js')




router.get('/', faultsCtl.getAllFaults)

module.exports = router