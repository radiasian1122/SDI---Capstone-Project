const { faker } = require('@faker-js/faker')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await knex('dispatches').del()

    // Get required data for foreign key references.
    const allRequestors = await knex.select('*').from('users')
    const allDrivers = await knex.select('*').from('users').join('driver_quals', 'driver_quals.user_id', 'users.dod_id' )
    const allVehicles = await knex.select('*').from('vehicles')
    const numberOfDispatches = faker.number.int({ min: 10, max: allVehicles.length })
    const seedDispatches = [];

    // Generate dispatches
    for (i = 0; i < numberOfDispatches; i++){

      // Generate start and end dates with faker
      let startDate = faker.date.soon({ days: 7 })
      let endDate = faker.date.between({ from: startDate, to: new Date(startDate.getTime() + faker.number.int({ min: 7, max: 14 }) * 24 * 60 * 60 * 1000) })

      let approved = faker.datatype.boolean(0.1) // 10% weight for approval

      let comments = faker.datatype.boolean() ? null : faker.lorem.sentence()

      seedDispatches.push({
        requestor_id: allRequestors[faker.number.int({ min: 0, max: allRequestors.length - 1 })].dod_id,
        driver_id: allDrivers[faker.number.int({ min: 0, max: allDrivers.length - 1 })].dod_id,
        vehicle_id: allVehicles[faker.number.int({ min: 0, max: allVehicles.length - 1 })].vehicle_id,
        approved: approved,
        start_time: startDate,
        end_time: endDate,
        destination: faker.location.city(),
        purpose: faker.lorem.sentence(),
        comments: !approved ? comments : null
      })
    }

    for (i = 0; i < 3; i++){
      let startDate = faker.date.soon({ days: 7 })
      let endDate = faker.date.between({ from: startDate, to: new Date(startDate.getTime() + faker.number.int({ min: 7, max: 14 }) * 24 * 60 * 60 * 1000) })

      let approved = faker.datatype.boolean()

      seedDispatches.push({
        requestor_id: 1234567890,
        driver_id: allDrivers[faker.number.int({ min: 0, max: allDrivers.length - 1 })].dod_id,
        vehicle_id: allVehicles[faker.number.int({ min: 0, max: allVehicles.length - 1 })].vehicle_id,
        approved: approved,
        start_time: startDate,
        end_time: endDate,
        destination: faker.location.city(),
        purpose: faker.lorem.sentence(),
        comments: approved ? null : faker.lorem.sentence()
      })
    }

    await knex('dispatches').insert(seedDispatches)
};
