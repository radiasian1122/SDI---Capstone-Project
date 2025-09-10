const knex = require('../db.js');

exports.getAllDrivers = async (req, res) => {
    try {
        const drivers = await knex("users as U")
            .innerJoin("users_roles as UR", "U.dod_id", "UR.user_id")
            .select("U.first_name", "U.last_name", "U.uic")
            .where("UR.role_id", 4);

        res.status(200).json(drivers);
    }catch (err) {}
}

exports.getAllQuals = async (req, res) => {
    try {
        const quals = await knex("qualifications as Q")
            .innerJoin("driver_quals as D", "Q.qual_id", "D.qual_id")
            .innerJoin("users as U", "U.dod_id", "D.user_id")
            .select("U.first_name", "U.last_name")
            .select(knex.raw("string_agg(\"Q\".\"platform\", ', ' ORDER BY \"Q\".\"platform\") as qualifications"))
            .groupBy("U.first_name", "U.last_name")
            .orderBy(["U.last_name", "U.first_name"]);

        quals.forEach(qual => {
            qual.qualifications = qual.qualifications.split(", ");
        })
        res.status(200).json(quals);

    }catch (err) {
        res.status(500).json({ error: err.message });
        console.error(err);
    }
}

