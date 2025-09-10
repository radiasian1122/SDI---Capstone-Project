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

exports.getDispatchesByUic = (req, res) => {
  console.log("Write code to get a dispatch by UIC here");
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
