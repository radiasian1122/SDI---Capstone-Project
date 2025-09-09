const express = require('express')
const router = express.Router()
const usersCtl = require('../controllers/users.js')

router.get('/', usersCtl.getAllUsers)
router.get('/:id', usersCtl.getUserById)
router.get('/:id/qual', usersCtl.getUserQualifications)

module.exports = router