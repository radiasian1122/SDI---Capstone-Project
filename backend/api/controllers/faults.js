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