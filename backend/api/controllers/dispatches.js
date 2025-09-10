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
  if (!req.body){
    res.status(400).json({
      message: "You must supply a body with this request."
    })
  }
  else if (
    !Object.hasOwn(req.body, "requestor_id") ||
    !Object.hasOwn(req.body, "driver_id") ||
    !Object.hasOwn(req.body, "vehicle_id")
  ){
    res.status(400).json({
      message: "Missing required parameters. See /docs endpoint."
    })
  }
  else{
    knex('dispatches').insert(req.body, ['dispatch_id','requestor_id','driver_id','vehicle_id','approved'])
    .then(newDispatch => res.status(200).send(newDispatch))
    .catch(err => {
      if (err){
        res.status(500).send(err.message)
        console.error(err.message)
      }
      else{
        res.status(500).json({
          message: "something went wrong"
        })
      }
    })
  }
}

exports.getDispatchesByUic = (req, res) => {
  console.log('Write code to get a dispatch by UIC here')
}