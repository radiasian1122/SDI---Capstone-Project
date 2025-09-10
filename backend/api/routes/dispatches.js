 const express = require('express')
const router = express.Router()
const dispatchesCtl = require('../controllers/dispatches.js')

//////// SWAGGER COMPONENTS //////////

/**
 * @swagger
 * components:
 *  dispatch:
 *    type: object
 *    properties:
 *      dispatch_id:
 *        type: integer
 *        example: 1
 *      requestor_id:
 *        type: bigint
 *        example: 1234567891
 *      driver_id:
 *        type: bigint
 *        example: 1234567891
 *      vehicle_id:
 *        type: integer
 *        example: 1
 *      approved:
 *        type: boolean
 *        example: false
 *  new_dispatch:
 *    type: object
 *    properties:
 *      requestor_id:
 *        type: bigint
 *        example: 1234567891
 *      driver_id:
 *        type: bigint
 *        example: 1234567891
 *      vehicle_id:
 *        type: integer
 *        example: 1
 */

///////// ROUTES DEFINITIONS ////////////

/**
 * @swagger
 * /dispatches:
 *   get:
 *     summary: Retrieve a list of all dispatches
 *     responses:
 *       200:
 *         description: Returns an array of all disptach objects whether they are active or inactive
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/dispatch'
 */
router.get('/', dispatchesCtl.getAllDispatches)

/**
 * @swagger
 * /dispatches/uic/{uic}:
 *   get:
 *     summary: Retrieve a list of all dispatches
 *     responses:
 *       200:
 *         description: Returns an array of all disptach objects whether they are active or inactive
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/dispatch'
 */
router.get('/uic/:uic', dispatchesCtl.getDispatchesByUic)

/**
 * @swagger
 * /dispatches:
 *  post:
 *    summary: Create a new dispatch
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/new_dispatch'
 *    responses:
 *      200:
 *        description: Returns an array containing the dispatch object that was created.
 *        content:
 *          application/json:
 *            schema:
 *               type: array
 *               items:
 *                $ref: '#/components/dispatch'
 */
router.post('/dispatches', dispatchesCtl.createNewDispatch)

module.exports = router