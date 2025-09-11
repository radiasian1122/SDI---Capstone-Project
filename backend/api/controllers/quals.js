const knex = require('../db.js');

exports.getAllQuals = async (req, res) => {
    try{
        const quals = await knex('qualifications').select('*');
        res.json(quals);
    }catch (err) {
        res.status(500).json({ error: err.message });
        console.error(err);
    }

}