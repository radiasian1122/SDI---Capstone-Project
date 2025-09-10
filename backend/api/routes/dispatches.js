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
router.get('/:uic', dispatchesCtl.getDispatchesByUic)

/**
 * @swagger
 * /dispatches/:driver_id:
 *   get:
 *     summary: Retrieve a list of all dispatches associated with a specific driver
 *     responses:
 *        404:
 *          description: No dispatches found for the given user
 *        200:
 *         description: Returns an array of all disptach objects associated with a specific driver whether they are active or not
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/dispatch'
 */
router.get('/:driver_id/all', dispatchesCtl.getDispatchesByDriver)

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
router.post('/disptaches', dispatchesCtl.createNewDispatch)

module.exports = router