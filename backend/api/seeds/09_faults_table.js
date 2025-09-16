const { faker } = require('@faker-js/faker')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await knex('faults').del()

    // Get all vehicles from vehicles table
    const allVehicles = await knex.select('*').from('vehicles')

    // Create 0-5 faults per vehicle
    let seedFaults = [];
    for (i = 0; i < allVehicles.length; i++){
      let numberOfFaults = faker.number.int({ min: 0, max: 5 })
      for (j = 0; j < numberOfFaults; j++){
        seedFaults.push({
          vehicle_id: allVehicles[i].vehicle_id,
          fault_code: faker.number.int({ min: 100, max: 999 }),
          fault_description: faker.lorem.lines(1),
          tech_status: faker.lorem.lines(1),
          corrective_action: faker.lorem.lines(1)
        })
      }
    }
    // Add newly created faults to faults table
    await knex('faults').insert(seedFaults)
};
