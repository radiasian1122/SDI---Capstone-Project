const knex = require("../db.js");

// Get all vehicles
exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await knex("vehicles").select("*").orderBy("vehicle_id");
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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
};

exports.getVehiclesByUic = async (req, res) => {
  try {
    const vehicles = await knex("vehicles")
      .where("uic", req.params.uic)
      .select("*");

    if (vehicles.length > 0) {
      res.json(vehicles);
    } else {
      res.status(404).json({
        error: `No vehicles found for UIC: ${req.params.uic}`,
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error(err);
  }
};

exports.updateVehicle = async (req, res) => {
    if (!req.body) {
        res.status(400).json({
            message: "Missing request body"
        })
    } else if (
        !Object.hasOwn(req.body, 'mileage_hours')
    ) {
        res.status(400).json({
            message: "Request body is missing required properties. See /docs endpoint"
        })
    }else {
        await knex('vehicles').where('vehicle_id', req.params.vehicle_id).update(req.body, ['mileage_hours'])
            .then(updatedVehicle => {
                res.status(200).send(updatedVehicle)
            })
            .catch( err => {
                    console.log(err.message)
                    res.status(500).json(err.message)
                }
            )
    }
}