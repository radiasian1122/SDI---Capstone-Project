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
* /dispatches:
*  patch:
*    summary: Update a fault
*    requestBody:
*      description: Request body **must** contain property **fault_id**. This will update the corresponding dispatch. Properties **driver_id**, **approved** and **comments** are optional fields for updating the dispatch.
*      content:
*        application/json:
*          schema:
    *            $ref: '#components/updated_dispatch'
*    responses:
*      200:
*        description: Returns an array containing a single object with properties **dispatch_id**, **driver_id**, and **approved**.
*        content:
    *          application/json:
*            schema:
    *               type: array
*               items:
*                $ref: '#/components/updated_dispatch_return'
*/

/**
 * @swagger
 * /faults/{fault_id}:
 *   patch:
 *     summary: Update a fault
 *     tags: [faults]
 *     description: Update a fault by providing any of the available fields
 *     parameters:
 *       - in: path
 *         name: fault_id
 *         required: true
 *         description: ID of the fault to update
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       description: The fault fields to be updated (at least one field required).
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vehicle_id:
 *                 type: integer
 *                 example: 3
 *               fault_code:
 *                 type: integer
 *                 example: 123
 *               fault_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-01-23"
 *               fault_description:
 *                 type: string
 *                 example: "Needs blinker fluid"
 *               tech_status:
 *                 type: string
 *                 example: "Fluid ordered"
 *               corrective_action:
 *                 type: string
 *                 example: "Tried adding motor oil, but it didn't work"
 *             minProperties: 1
 *     responses:
 *       200:
 *         description: Successfully updated the fault
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   vehicle_id:
 *                     type: integer
 *                   fault_code:
 *                     type: integer
 *                   fault_description:
 *                     type: string
 *                   fault_date:
 *                     type: string
 *                   tech_status:
 *                     type: string
 *                   corrective_action:
 *                     type: string
 *       400:
 *         description: Bad request - missing request body or required properties
 *       500:
 *         description: Internal server error
 */

router.patch('/:fault_id', faultsCtl.updateFault)

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