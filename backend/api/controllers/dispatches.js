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
  console.log('Write code to create a dispatch here')
}

exports.getDispatchesByUic = (req, res) => {
  console.log('Write code to get a dispatch by UIC here')
}
