const knex = require('../db.js')

exports.getVehicleById = (req, res) => {
  knex.select('*').where('whatever')
}

exports.addNewVehicle = (req, res) => {

}