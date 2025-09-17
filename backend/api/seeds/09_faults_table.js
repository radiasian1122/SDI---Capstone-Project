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
    const allFaultDescriptions = [
      "Failed transmission",
      "Left turn signal inop",
      "Windshield wipers inop",
      "Class 1 oil leak",
      "Class 2 oil leak",
      "Class 3 oil leak",
      "Class 1 transmission fluid leak",
      "Class 2 transmission fluid leak",
      "Class 3 transmission fluid leak",
      "Class 1 coolant leak",
      "Class 2 coolant leak",
      "Class 3 coolant leak",
      "Power steering inop",
      "Failing piston head",
      "Overdue for services"
    ]

    const allCorrectiveAction = [
      "Added 1QT oil",
      "Added 2QT oil",
      "Added 3QT oil",
      "Added 1QT transmission fluid",
      "Added 2QT transmission fluid",
      "Added 3QT transmission fluid",
      "Added 1QT coolant",
      "Added 2QT coolant",
      "Added 3QT coolant",
      "Added 1QT power steering fluid",
      "Rotated tires"
    ]

    const allTechStatus = [
      "nff",
      "faults-found",
      "deadlined",
      "safety-deadlined"
    ]

    // Create 0-5 faults per vehicle
    let seedFaults = [];
    for (i = 0; i < allVehicles.length; i++){
      let numberOfFaults = faker.number.int({ min: 0, max: 5 })

      if (numberOfFaults > 0){
        await knex('vehicles').where({ vehicle_id: allVehicles[i].vehicle_id }).update('deadlined', faker.datatype.boolean(0.2))
      }

      for (j = 0; j < numberOfFaults; j++){
        seedFaults.push({
          vehicle_id: allVehicles[i].vehicle_id,
          fault_code: faker.number.int({ min: 100, max: 999 }),
          fault_description: allFaultDescriptions[faker.number.int({ min: 0, max: allFaultDescriptions.length -1 })],
          tech_status: allTechStatus[faker.number.int({ min: 0, max: allTechStatus.length -1 })],
          corrective_action: allCorrectiveAction[faker.number.int({ min: 0, max: allCorrectiveAction.length -1 })]
        })
      }
    }
    // Add newly created faults to faults table
    await knex('faults').insert(seedFaults)
};
