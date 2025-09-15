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

/**
 * @swagger
 * /vehicles/id/{vehicle_id}:
 *   patch:
 *     summary: Update a vehicle
 *     tags: [vehicles]
 *     description: Update a vehicle's mileage hours
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the vehicle to update
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       description: The vehicle fields to be updated.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mileage_hours:
 *                 type: integer
 *                 example: 1500
 *             required:
 *               - mileage_hours
 *     responses:
 *       200:
 *         description: Successfully updated the vehicle
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   mileage_hours:
 *                     type: integer
 *       400:
 *         description: Bad request - missing request body or required properties
 *       500:
 *         description: Internal server error
*/

router.patch('/id/:vehicle_id', vehiclesCtl.updateVehicle)

module.exports = router