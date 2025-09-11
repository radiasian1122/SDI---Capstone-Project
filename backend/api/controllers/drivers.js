const knex = require('../db.js');
const { formatDrivers, formatDriverById, formatDriversByQualId } = require('../utils.js');




exports.getAllDrivers = async (req, res) => {
    await formatDrivers(req, res);
}

exports.getDriverById = async (req, res) => {
    await formatDriverById(req, res);
}

exports.getDriversByQualId = async (req, res) => {
    await formatDriversByQualId(req, res);
}

