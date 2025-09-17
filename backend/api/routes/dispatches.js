const express = require("express");
const router = express.Router();
const dispatchesCtl = require("../controllers/dispatches.js");

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
 *  updated_dispatch:
 *    type: object
 *    properties:
 *      driver_id:
 *        type: bigint
 *        example: 1234567891
 *      approved:
 *        type: boolean
 *        example: true
 *  updated_dispatch_return:
 *    type: object
 *    properties:
 *      dispatch_id:
 *        type: integer
 *        example: 1
 *      driver_id:
 *        type: bigint
 *        example: 1234567891
 *      approved:
 *        type: boolean
 *        example: true
 *      comments:
 *        type: string
 *        example: "Your wish has been granted"
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
router.get("/", dispatchesCtl.getAllDispatches);

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
 *      400:
 *        description: Request did not contain a request body or failed to send required properties with request body.
 *      200:
 *        description: Returns an array containing the dispatch object that was created.
 *        content:
 *          application/json:
 *            schema:
 *               type: array
 *               items:
 *                $ref: '#/components/dispatch'
 */
router.post("/", dispatchesCtl.createNewDispatch);

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
router.get("/uic/:uic", dispatchesCtl.getDispatchesByUic);

/**
 * @swagger
 * /dispatches:
 *  patch:
 *    summary: Update a dispatch
 *    requestBody:
 *      description: Request body **must** contain property **dispatch_id**. This will update the corresponding dispatch. Properties **driver_id**, **approved** and **comments** are optional fields for updating the dispatch.
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
router.patch("/", dispatchesCtl.updateDispatch);


/**
 * @swagger
 * /dispatches/{dispatch_id}:
 *   delete:
 *     summary: Delete a dispatch
 *     parameters:
 *       - in: path
 *         name: dispatch_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the dispatch to delete
 *     responses:
 *       200:
 *         description: Dispatch successfully deleted
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Dispatch deleted
 *       404:
 *         description: Dispatch not found
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Dispatch not found
 */
router.delete("/:dispatch_id", dispatchesCtl.deleteDispatch)

module.exports = router;
