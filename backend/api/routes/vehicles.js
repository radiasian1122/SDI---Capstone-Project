const express = require('express')
const router = express.Router()
const vehiclesCtl = require('../controllers/vehicles.js')

///////// SWAGGER COMPONENTS //////////

/**
 * @swagger
 * components:
 *   vehicle:
 *     type: object
 *     properties:
 *       vehicle_id:
 *         type: integer
 *         example: 1
 *       uic:
 *         type: string
 *         example: WAB4AA
 *       platform_variant:
 *         type: integer
 *         example: 1
 *       bumper_no:
 *         type: string
 *         example: A001
 *       deadlined:
 *         type: boolean
 *         example: false
 */

/////////// ROUTE DEFINITIONS ///////////

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
 *                 $ref: '#/components/vehicle'
 */
router.get('/', vehiclesCtl.getAllVehicles)


/**
 * @swagger
 * /vehicles/uic/{uic}:
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
 *                 $ref: '#/components/vehicle'
 */
router.get('/uic/:uic', vehiclesCtl.getVehiclesByUic)

/**
 * @swagger
 * /vehicles/id/{id}:
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
 *                 $ref: '#/components/vehicle'
 */
router.get('/id/:id', vehiclesCtl.getVehicleById)

router.patch('/id/:id', vehiclesCtl.updateVehicle)

module.exports = router