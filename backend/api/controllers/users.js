const knex = require("../db.js");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await knex("users").select("*");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
      console.error(err);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await knex("users").where("dod_id", req.params.id).first();
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
      console.error(err)
  }
};

exports.getUserQualifications = async (req, res) => {
  try {
    const quals = await knex("driver_quals").where("user_id", req.params.id);
    res.json(quals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createNewUser = (req, res) => {
  if (!req.body){
    res.status(400).json({
      message: "You must supply a body with this request"
    })
  }
  else if(
    !Object.hasOwn(req.body, "dod_id") || !Object.hasOwn(req.body, "uic")
  ){
    res.status(400).json({
      message: "Missing required parameters in request body"
    })
  }
  else{
    knex('users').insert(req.body, ['dod_id','uic'])
    .then(createdUser => {
      res.status(200).send(createdUser)
    })
    .catch(err => {
      if (err){
        console.log(err.message)
        res.status(500).send(err.message)
      }
    })
  }
}
