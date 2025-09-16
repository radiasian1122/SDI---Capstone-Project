const knex = require("../db.js");
const {formatUsers, formatUserById} = require('../utils.js')

exports.getAllUsers = async (req, res) => {
  try {
    await formatUsers(req, res);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error(err);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await formatUserById(req, res);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error(err);
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

exports.getUsersByQualification = async (req, res) => {
  try {
    const users = await knex("users as u")
      .join("driver_quals as dq", "u.dod_id", "=", "dq.user_id")
      .join("qualifications as q", "dq.qual_id", "=", "q.qual_id")
      .where("q.platform", req.params.platform)
      .select(
        "u.dod_id",
        "u.first_name",
        "u.last_name",
        "q.platform",
        "q.variant"
      )
      .orderBy("u.last_name");

    if (users.length > 0) {
      res.status(200).json(users);
    } else {
      res.status(404).json({
        error: `No users found with qualification for platform: ${req.params.platform}`,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to retrieve qualified users",
      details: err.message,
    });
  }
};
