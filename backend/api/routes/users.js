const express = require('express')
const router = express.Router()
const usersCtl = require('../controllers/users.js')


/**
 * @swagger
 * components:
 *  user:
 *    type: object
 *    properties:
 *      dod_id:
 *        type: integer
 *        example: 1234567891
 *      username:
 *        type: string
 *        example: joe.snuffy
 *      password:
 *        type: string
 *        example: $5$MnfsQ4iN$ZMTppKN16y/tIsUYs/obHlhdP.Os80yXhTurpBMUbA5
 *      uic:
 *        type: string
 *        example: NF5HA0
 *      first_name:
 *        type: string
 *        example: Joseph
 *      last_name:
 *        type: string
 *        example: Snuffy
 */


/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     responses:
 *       200:
 *         description: Returns an array of all user objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/user'
 */
router.get('/', usersCtl.getAllUsers)

/**
 * @swagger
 * /users/:id:
 *   get:
 *     summary: Get a single user by user ID (DOD ID)
 *     responses:
 *       200:
 *         description: Returns an array of a single user object matching the given user ID
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/user'
 */
router.get('/:id', usersCtl.getUserById)

/**
 * @swagger
 * /users/:id/qual:
 *   get:
 *     summary: Get a single user by user ID (DOD ID)
 *     responses:
 *       200:
 *         description: Returns an array of a single user object matching the given user ID
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   dod_id:
 *                     type: integer
 *                     example: 1234567891
 *                   qualifications:
 *                     type: array
 *                     example: [{ qual_id: 1, platform: "JLTV", variant: "113"}, { qual_id: 1, platform: "LMTV", variant: "559"}]
 */
router.get('/:id/qual', usersCtl.getUserQualifications)

module.exports = router