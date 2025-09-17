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

    const allComments = [
      "Requires commander's approval",
      "Cannot dispatch vehicle with this fault",
      "Driver not qualified",
      "Vehicle due for maintenance",
      "Missing trip ticket documentation",
      "Fuel card not available",
      "Destination outside authorized area",
      "Overnight dispatch requires additional approval",
      "Driver's license expired",
      "Vehicle not equipped for mission",
      "Dispatch overlaps with another reservation",
      "Weather conditions may affect travel",
      "Cargo exceeds vehicle capacity",
      "Vehicle needs cleaning before dispatch",
      "Requestor must provide justification",
    ]

    allPurposes = [
      "Range operations",
      "JRTC Rotation",
      "Gunnery at YTA",
      "Ammo transportation to range",
      "Convoy training exercise",
      "Field training exercise",
      "Personnel transport",
      "Equipment delivery",
      "Medical evacuation drill",
      "Supply run to main post",
      "Reconnaissance mission",
      "Command staff movement",
      "Maintenance support run",
      "Vehicle recovery operation"
    ]

    // Generate dispatches
    for (i = 0; i < numberOfDispatches; i++){

      // Generate start and end dates with faker
      let startDate = faker.date.soon({ days: 7 })
      let endDate = faker.date.between({ from: startDate, to: new Date(startDate.getTime() + faker.number.int({ min: 7, max: 14 }) * 24 * 60 * 60 * 1000) })

      let approved = faker.datatype.boolean(0.1) // 10% weight for approval

      let comments = faker.datatype.boolean() ? null : allComments[faker.number.int({ min: 0, max: allComments.length -1 })]
      let purpose = allPurposes[faker.number.int({ min: 0, max: allPurposes.length -1 })]

      seedDispatches.push({
        requestor_id: allRequestors[faker.number.int({ min: 0, max: allRequestors.length - 1 })].dod_id,
        driver_id: allDrivers[faker.number.int({ min: 0, max: allDrivers.length - 1 })].dod_id,
        vehicle_id: allVehicles[faker.number.int({ min: 0, max: allVehicles.length - 1 })].vehicle_id,
        approved: approved,
        start_time: startDate,
        end_time: endDate,
        destination: faker.location.city(),
        purpose: purpose,
        comments: !approved ? comments : null
      })
    }

    for (i = 0; i < 3; i++){
      let startDate = faker.date.soon({ days: 7 })
      let endDate = faker.date.between({ from: startDate, to: new Date(startDate.getTime() + faker.number.int({ min: 7, max: 14 }) * 24 * 60 * 60 * 1000) })

      let approved = faker.datatype.boolean()
      let purpose = allPurposes[faker.number.int({ min: 0, max: allPurposes.length -1 })]
      let comments = faker.datatype.boolean() ? null : allComments[faker.number.int({ min: 0, max: allComments.length -1 })]

      seedDispatches.push({
        requestor_id: 1234567890,
        driver_id: allDrivers[faker.number.int({ min: 0, max: allDrivers.length - 1 })].dod_id,
        vehicle_id: allVehicles[faker.number.int({ min: 0, max: allVehicles.length - 1 })].vehicle_id,
        approved: approved,
        start_time: startDate,
        end_time: endDate,
        destination: faker.location.city(),
        purpose: purpose,
        comments: !approved ? comments : null
      })
    }

    await knex('dispatches').insert(seedDispatches)
};
