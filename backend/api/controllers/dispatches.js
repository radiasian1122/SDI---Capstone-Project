const knex = require("../db.js");

exports.getAllDispatches = async (req, res) => {
  try {
    const dispatches = await knex("dispatches").select("*");
    res.json(dispatches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDispatchesByDriver = async (req, res) => {
  try {
    const dispatches = await knex("dispatches").where(
      "driver_id",
      req.params["driver-id"]
    );
    res.json(dispatches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createNewDispatch = (req, res) => {
  console.log("Write code to create a dispatch here");
};

exports.getDispatchesByUic = async (req, res) => {
  try {
    const dispatches = await knex("dispatches as d")
      .join("vehicles as v", "d.vehicle_id", "=", "v.vehicle_id")
      .join("users as u", "d.requestor_id", "=", "u.dod_id")
      .join("units as un", "v.uic", "=", "un.uic")
      .where("v.uic", req.params.uic)
      .select(
        "d.*",
        "v.platform",
        "v.variant",
        "v.bumper_no",
        "u.first_name as requestor_first_name",
        "u.last_name as requestor_last_name",
        "un.common_name as unit_name"
      );

    if (dispatches.length > 0) {
      res.status(200).json(dispatches);
    } else {
      res.status(404).json({
        error: `No dispatches found for UIC: ${req.params.uic}`,
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error(err);
  }
};

exports.getDispatchByRequestorId = async (req, res) => {
  try {
    const dispatches = await knex("dispatches")
      .where("requestor_id", req.params.requestorId)
      .select("*");

    if (dispatches.length > 0) {
      res.status(200).json(dispatches);
    } else {
      res.status(404).json({
        error: `No dispatches found for requestor ID: ${req.params.requestorId}`,
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error(err);
  }
};
