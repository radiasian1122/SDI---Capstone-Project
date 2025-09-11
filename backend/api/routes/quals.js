const express = require('express');
const router = express.Router();
const qualsCtl = require('../controllers/quals.js')


/**
 * @swagger
 * components:
 *   schemas:
 *     qual:
 *       type: object
 *       properties:
 *         qual_id:
 *           type: integer
 *           example: "3"
 *         platform:
 *           type: string
 *           example: "JLTV"
 *         variant:
 *           type: string
 *           example: "some-variant"
 *
 *     new_qual:
 *       type: object
 *       properties:
 *         qual_id:
 *           type: integer
 *           example: "4"
 *         platform:
 *           type: string
 *           example: "JLTV"
 *         variant:
 *           type: string
 *           example: "some-variant"
 *
 */

/**
 * @swagger
 * /quals:
 *   get:
 *     summary: Get a list of all qualifications
 *     tags: [quals]
 *     description: Retrieves all qualifications
 *     responses:
 *       200:
 *         description: Successfully retrieved all qualifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/qual'
 */
router.get('/', qualsCtl.getAllQuals);

module.exports = router;