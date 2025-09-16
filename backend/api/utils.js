import {faker} from '@faker-js/faker';
import knex from "./db.js";


// class User{
//   constructor() {
//       this.dodId = faker.number.int({min: 1000000000, max:9999999999});
//       this.firstName = faker.person.firstName('male');
//       this.lastName = faker.person.lastName('male');
//       this.username = `${this.firstName}-${this.lastName}`;
//       this.password = 'password';
//   }
// }
const uicArray = ['NF5HA0', 'NF5HB0', 'NF5HC0']


export const masterUsersList = generateUsers();

export function generateUsers() {

    const userArray = []

    //Users meant to be requestors
    for (let i = 0; i < uicArray.length; i++) {
        for (let j = 0; j < 15; j++) {

            const fakeFirstName = faker.person.firstName('male');
            const fakeLastName = faker.person.lastName('male');

            userArray.push({
                dod_id: faker.number.int({min: 1000000000, max: 9999999999}),
                username: `${fakeFirstName.toLowerCase()}-${fakeLastName.toLowerCase()}`,
                password: 'password',
                uic: uicArray[i],
                first_name: fakeFirstName,
                last_name: fakeLastName,
            })
        }

        //Users meant to be drivers
        for (let k = 0; k < 20; k++) {

            const fakeFirstName = faker.person.firstName('male');
            const fakeLastName = faker.person.lastName('male');

            userArray.push({
                dod_id: faker.number.int({min: 1000000000, max: 9999999999}),
                uic: uicArray[i],
                first_name: fakeFirstName,
                last_name: fakeLastName,
            })
        }
    }
    return userArray;//User array length is 90
}

export async function formatUsers(req, res) {

    const users = await knex('roles as R')
        .innerJoin('users_roles as UR', 'R.role_id', 'UR.role_id')
        .innerJoin('users as U', 'U.dod_id', 'UR.user_id')
        .select(
            'U.dod_id',
            'U.first_name',
            'U.last_name'
        )
        .select(knex.raw("string_agg(\"R\".\"role_name\", ', ' ORDER BY \"R\".\"role_name\") as roles"))
        .groupBy('U.dod_id', 'U.first_name', 'U.last_name')
        .orderBy('U.last_name')

    users.forEach(user => {
        user.roles = user.roles.split(', ');
    })
    res.json(users);
}

export async function formatUserById(req, res) {
    const user = await knex('roles as R')
        .innerJoin('users_roles as UR', 'R.role_id', 'UR.role_id')
        .innerJoin('users as U', 'U.dod_id', 'UR.user_id')
        .select(
            'U.dod_id',
            'U.first_name',
            'U.last_name'
        )
        .select(knex.raw("string_agg(\"R\".\"role_name\", ', ' ORDER BY \"R\".\"role_name\") as roles"))
        .groupBy('U.dod_id', 'U.first_name', 'U.last_name')
        .orderBy('U.last_name')
        .where('U.dod_id', req.params.id).first()


    user.roles = user.roles.split(', ')

    res.json(user);
}

export function generateUsersRoles() {
    const usersRolesArray = [];
    const users = masterUsersList;
    for (let i = 0; i < users.length; i++) {
        if (i < 30) {
            usersRolesArray.push({
                user_id: users[i].dod_id,
                role_id: 1//requestor
            })
        } else if (i >= 30 && i < 45) {
            usersRolesArray.push({
                user_id: users[i].dod_id,
                role_id: 3//approver
            })
        } else if (i >= 45 && i < users.length) {
            usersRolesArray.push({
                user_id: users[i].dod_id,
                role_id: 4//driver
            })
        }
    }
    return usersRolesArray;
}

export function generateVehicles() {
    //Bumper no. format "JLTV-1, JLTV-2. etc."
    const vehicleTypes = ['JLTV', '1.1', 'STRYKER', 'MRZR', 'ISV', 'LMTV', 'TLC', 'RFSS', 'QUAD']
    let vehicles = []

    for (let i = 0; i < uicArray.length; i++) {
        for (let j = 0; j < vehicleTypes.length; j++) {
            for (let k = 0; k < 3; k++) {
                vehicles.push({
                    uic: uicArray[i],
                    platform_variant: j + 1,
                    bumper_no: `${vehicleTypes[j]}-${k + 1}`,
                    deadlined: false,
                    mileage_hours: faker.number.int({min: 0, max: 1000000})
                })
            }
        }
    }


    return vehicles;
}

export function generateDriverQuals() {
    const driverQuals = []

    for (let i = 46; i < masterUsersList.length; i++) {
        for (let j = 0; j < 9; j++)
            driverQuals.push({
                user_id: masterUsersList[i].dod_id,
                qual_id: j + 1
            })
    }
    return driverQuals;
}

//Formats the drivers table to be used in the frontend
export async function formatDrivers(req, res) {

    try {
        const drivers = await knex("qualifications as Q")
            .innerJoin("driver_quals as D", "Q.qual_id", "D.qual_id")
            .innerJoin("users as U", "U.dod_id", "D.user_id")
            .select("U.first_name", "U.last_name", "U.uic", "U.dod_id")
            .select(knex.raw("string_agg(\"Q\".\"platform\", ', ' ORDER BY \"Q\".\"platform\") as qualifications"))
            .groupBy("U.first_name", "U.last_name", "U.uic", "U.dod_id")
            .orderBy(["U.last_name", "U.first_name"]);

        drivers.forEach(driver => {
            driver.qualifications = driver.qualifications.split(", ");
        })
        res.status(200).json(drivers);

    } catch (err) {
        res.status(500).json({error: err.message});
        console.error(err);
    }
}

//Gets a single driver by dod_id and properly formats the data to be used in the frontend
export async function formatDriverById(req, res) {
    try {
        const driver = await knex("qualifications as Q")
            .innerJoin("driver_quals as D", "Q.qual_id", "D.qual_id")
            .innerJoin("users as U", "U.dod_id", "D.user_id")
            .select("U.first_name", "U.last_name", "U.uic", "U.dod_id")
            .select(knex.raw("string_agg(\"Q\".\"platform\", ', ' ORDER BY \"Q\".\"platform\") as qualifications"))
            .groupBy("U.first_name", "U.last_name", "U.uic", "U.dod_id")
            .orderBy(["U.last_name", "U.first_name"])
            .where("U.dod_id", req.params.id)


        driver[0].qualifications = driver[0].qualifications.split(", ");

        res.status(200).json(driver);

    } catch (err) {
        res.status(500).json({error: err.message});
        console.error(err);
    }
}

export async function formatDriversByQualId(req, res) {
    try {
        const drivers = await knex('driver_quals as D')
            .innerJoin('users as U', 'U.dod_id', 'D.user_id')
            .innerJoin('qualifications as Q', 'Q.qual_id', 'D.qual_id')
            .select('U.first_name', 'U.last_name', 'U.uic', 'U.dod_id')
            .where('D.qual_id', req.params.qualId)
            .orderBy(['U.last_name', 'U.first_name']);


        res.status(200).json(drivers);

    } catch (err) {
        res.status(500).json({error: err.message});
        console.error(err);
    }
}

