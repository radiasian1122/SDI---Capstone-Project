const express = require('express')
const router = express.Router()
const vehiclesCtl = require('../controllers/vehicles.js')

/**
 * @swagger
 * /vehicles:
 *   get:
 *     summary: Retrieve a list of vehicles
 *     responses:
 *       200:
 *         description: Returns an array of all vehicle objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   vehicle_id:
 *                     type: integer
 *                     example: 1
 *                   uic:
 *                     type: string
 *                     example: WAB4AA
 *                   platform_variant:
 *                     type: integer
 *                     example: 1
 *                   bumper_no:
 *                     type: string
 *                     example: A001
 *                   deadlined:
 *                     type: boolean
 *                     example: false
 */
router.get('/', vehiclesCtl.getAllVehicles)

/**
 * @swagger
 * /vehicles/:id:
 *   get:
 *     summary: Retrieve a single vehicle by vehicle ID
 *     responses:
 *       200:
 *         description: Returns an array with a single vehicle object matching the vehicle id
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   vehicle_id:
 *                     type: integer
 *                     example: 1
 *                   uic:
 *                     type: string
 *                     example: WAB4AA
 *                   platform_variant:
 *                     type: integer
 *                     example: 1
 *                   bumper_no:
 *                     type: string
 *                     example: A001
 *                   deadlined:
 *                     type: boolean
 *                     example: false
 */
router.get('/:id', vehiclesCtl.getVehicleById)

module.exports = router