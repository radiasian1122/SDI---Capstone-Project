const express = require('express')
const router = express.Router()
const dispatchesCtl = require('../controllers/dispatches.js')


/**
 * @swagger
 * components:
 *  dispatches:
 *    type: object
 *    properties:
 *      dispatch_id:
 *        type: integer
 *        example: 1
 *      driver_id:
 *        type: integer
 *        example: 1234567891
 *      vehicle_id:
 *        type: integer
 *        example: 1
 *      approved:
 *        type: boolean
 *        example: false
 */

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
 *                 type: object
 *                 properties:
 *                   dispatch_id:
 *                     type: integer
 *                     example: 1
 *                   driver_id:
 *                     type: integer
 *                     example: 1234567891
 *                   vehicle_id:
 *                     type: integer
 *                     example: 1
 *                   active:
 *                     type: boolean
 *                     example: true
 */
router.get('/', dispatchesCtl.getAllDispatches)

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
 *                 type: object
 *                 properties:
 *                   dispatch_id:
 *                     type: integer
 *                     example: 1
 *                   driver_id:
 *                     type: integer
 *                     example: 1234567891
 *                   vehicle_id:
 *                     type: integer
 *                     example: 1
 *                   active:
 *                     type: boolean
 *                     example: true
 */
router.get('/:driver_id/all', dispatchesCtl.getDispatchesByDriver)

module.exports = router