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

exports.createNewFault = (req, res) => {
  if (!req.body){
    res.status(400).json({
      message: "You must supply a body with this request."
    })
  }
  try{
    knex("faults").insert(req.body, ['fault_id'])
    .then(data => res.status(200).send(data))
    .catch(err => res.status(500).send(err.message))
  }
  catch(err){
    res.status(500).json({
      message: "Something went wrong. See /docs endpoint.",
      error: err.message
    })
  }
}

exports.deleteFault = (req, res) => {
  try{
    knex("faults").where({ fault_id: req.params.fault_id }).del()
    .then(data => res.status(200).send(data))
    .catch(err => res.status(400).send(err.message))
  }
  catch(err){
    res.status(500).send(err.message)
  }
}