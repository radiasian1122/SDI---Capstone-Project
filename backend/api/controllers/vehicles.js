const knex = require("../db.js");

// Get all vehicles
exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await knex("vehicles").select("*");
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get vehicle by ID
exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await knex("vehicles")
      .where("vehicle_id", req.params.id)
      .first();
    if (vehicle) {
      res.json(vehicle);
    } else {
      res.status(404).json({ error: "Vehicle not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.getVehiclesByUic = (req, res) => {
  console.log('Write code to get a dispatch by UIC here')
}