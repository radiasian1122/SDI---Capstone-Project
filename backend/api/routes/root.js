const express = require('express')
const router = express.Router()
const rootCtl = require('../controllers/root.js')

router.get('/', rootCtl.serverIsRunning)

module.exports = router