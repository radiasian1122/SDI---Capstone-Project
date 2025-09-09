const express = require('express')
const router = express.Router()
const rootCtl = require('../controllers/root.js')

/**
 * @swagger
 * /:
 *   get:
 *     summary: Show that the server is running
 *     responses:
 *       200:
 *         description: Returns 'API server is running'
 */
router.get('/', rootCtl.serverIsRunning)

module.exports = router