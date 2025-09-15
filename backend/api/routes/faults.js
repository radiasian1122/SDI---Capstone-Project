const express = require('express')
const router = express.Router()
const faultsCtl = require('../controllers/faults.js')

/**
 * @swagger
 * components:
 *   schemas:
 *     fault:
 *       type: object
 *       properties:
 *         vehicle_id:
 *           type: integer
 *           example: 3
 *         fault_code:
 *           type: integer
 *           example: 123
 *         fault_date:
 *           type: string
 *           format: date
 *           example: "2025-01-23"
 *         fault_description:
 *           type: string
 *           example: "Needs blinker fluid"
 *         tech_status:
 *           type: string
 *           example: "Fluid ordered"
 *         corrective_action:
 *           type: string
 *           example: "Tried adding motor oil, but it didn't work"
 *     deleted_fault:
 *       type: object
 *       properties:
 *         fault_id:
 *           type: integer
 *           example: 1
 */

/**
 * @swagger
 * /faults:
 *   get:
 *     summary: Get a list of all faults
 *     tags: [faults]
 *     description: Retrieves all faults
 *     responses:
 *       200:
 *         description: Successfully retrieved all faults
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/fault'
 */
router.get('/', faultsCtl.getAllFaults)

/**
 * @swagger
 * /faults/{vehicle_id}:
 *   post:
 *     summary: Get a list of all faults associated with a vehicle
 *     tags: [faults]
 *     description: Retrieves all faults associated with the vehicle
 *     responses:
 *       200:
 *         description: Successfully retrieved all faults associated with the vehicle
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/fault'
 */
router.get('/:vehicle_id', faultsCtl.getFaultsByVehicleId)

/**
 * @swagger
 * /faults/{vehicle_id}:
 *   get:
 *     summary: Create a new fault associated with the specific vehicle
 *     tags: [faults]
 *     description: Create a new fault associated with the specific vehicle
 *     requestBody:
 *       description: The fault to be created.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/fault'
 *     responses:
 *       200:
 *         description: Create a new fault associated with the specific vehicle
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/fault'
 */
router.post('/', faultsCtl.createNewFault)

/**
 * @swagger
 * /faults/{fault_id}:
 *   delete:
 *     summary: Delete the corresponding fault
 *     tags: [faults]
 *     description: Delete the corresponding fault
 *     responses:
 *       200:
 *         description: Id of the fault that was deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/deleted_fault'
 */
router.delete('/:fault_id', faultsCtl.deleteFault)

module.exports = router