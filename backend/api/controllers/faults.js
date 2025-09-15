const knex = require("../db.js");

// Get all faults
exports.getAllFaults = async (req, res) => {
    try {
        const faults = await knex("faults").select("*");
        res.json(faults);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.error(err);
    }
}

exports.getFaultsByVehicleId = (req, res) => {
  try {
    knex("faults").select("*").where({ vehicle_id: req.params.vehicle_id })
    .then(data => res.status(200).send(data))
    .catch(err => res.status(500).send(err))
  }
  catch (err){
    res.status(500).send(err)
  }
}