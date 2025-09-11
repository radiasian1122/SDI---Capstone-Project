const knex = require('../db.js');
const { formatDrivers, formatDriverById } = require('../utils.js');




exports.getAllDrivers = async (req, res) => {
    await formatDrivers(req, res);
}

exports.getDriverById = async (req, res) => {
    await formatDriverById(req, res);
}

