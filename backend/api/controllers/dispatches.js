const knex = require("../db.js");

exports.getAllDispatches = async (req, res) => {
  try {
    const dispatches = await knex("dispatches").select("*").orderBy("dispatch_id");
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
  if (!req.body) {
    res.status(400).json({
      message: "You must supply a body with this request.",
    });
  } else if (
    !Object.hasOwn(req.body, "requestor_id") ||
    !Object.hasOwn(req.body, "driver_id") ||
    !Object.hasOwn(req.body, "vehicle_id")
  ) {
    res.status(400).json({
      message: "Missing required parameters. See /docs endpoint.",
    });
  } else {
    knex("dispatches")
      .insert(req.body, [
        "dispatch_id",
        "requestor_id",
        "driver_id",
        "vehicle_id",
        "approved",
      ])
      .then((newDispatch) => res.status(200).send(newDispatch))
      .catch((err) => {
        if (err) {
          res.status(500).send(err.message);
          console.error(err.message);
        } else {
          res.status(500).json({
            message: "something went wrong",
          });
        }
      });
  }
};

exports.getDispatchesByUic = async (req, res) => {
  try {
    const dispatches = await knex("dispatches as D")
        .select(
            "D.dispatch_id",
            "D.requestor_id",
            "D.driver_id",
            "D.vehicle_id",
            "D.approved"
        )
        .join("users as U", "D.requestor_id", "U.dod_id")
        .where("U.uic", req.params.uic);


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

exports.updateDispatch = (req, res) => {
  if (!req.body){
    res.status(400).json({
      message: "Missing request body"
    })
  }
  else if(
    !Object.hasOwn(req.body, "dispatch_id") &&
    !Object.hasOwn(req.body, "driver_id") &&
    !Object.hasOwn(req.body, "approved") &&
    !Object.hasOwn(req.body, "comments")
  ){
    res.status(400).json({
      message: "Request body is missing required properties. See /docs endpoint."
    })
  }
  else{
    knex('dispatches').where({ dispatch_id: req.body.dispatch_id }).update(req.body, ['dispatch_id', 'approved', 'driver_id', 'comments'])
    .then(updatedDispatch => {
      res.status(200).send(updatedDispatch)
    })
    .catch(err => {
      console.log(err.message)
      res.status(500).send(err.message)
    })
  }
}
