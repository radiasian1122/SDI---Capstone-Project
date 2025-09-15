const express = require('express');
const router = express.Router();
const driversCtl = require('../controllers/drivers.js')


/**
 * @swagger
 * components:
 *   schemas:
 *     driver:
 *       type: object
 *       properties:
 *         first_name:
 *           type: string
 *           example: "John"
 *         last_name:
 *           type: string
 *           example: "Smith"
 *         uic:
 *           type: string
 *           example: "NF5HA0"
 *         qualifications:
 *           type: array
 *           items:
 *             type: string
 *           example: ["JLTV", "LMTV", "STRYKER"]
 *
 *     new_driver:
 *       type: object
 *       properties:
 *         first_name:
 *           type: string
 *           example: "John"
 *         last_name:
 *           type: string
 *           example: "Smith"
 *         uic:
 *           type: string
 *           example: "NF5HA0"
 *         qualifications:
 *           type: array
 *           items:
 *             type: string
 *           example: ["JLTV", "LMTV", "STRYKER"]
 */

/**
 * @swagger
 * /drivers:
 *   get:
 *     summary: Get all drivers with their qualifications
 *     tags: [Drivers]
 *     description: Retrieves all drivers along with their vehicle platform qualifications, grouped by driver and sorted by last name, first name
 *     responses:
 *       200:
 *         description: Successfully retrieved all drivers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/driver'
 */
router.get('/', driversCtl.getAllDrivers)

/**
 * @swagger
 * /drivers/{id}:
 *   get:
 *     summary: Get a driver with their qualifications by driver ID
 *     tags: [Drivers]
 *     description: Retrieves a driver along with that driver's vehicle platform qualifications, grouped by driver and sorted by last name, first name
 *     responses:
 *       200:
 *         description: Successfully retrieved driver
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/driver'
 */
router.get('/:id', driversCtl.getDriverById)

router.get('/qual/:qualId', driversCtl.getDriversByQualId)

module.exports = router;