const knex = require('../db.js');
const { formatDrivers } = require('../utils.js');




exports.getAllDrivers = async (req, res) => {
    await formatDrivers(req, res);
}

exports.getDriverById = async (req, res) => {

}

