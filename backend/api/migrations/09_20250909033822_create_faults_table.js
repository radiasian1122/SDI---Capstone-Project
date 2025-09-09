/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('faults', table => {
      table.increments('fault_id')
      table.integer('vehicle_id')
      table.foreign('vehicle_id').references('vehicles.vehicle_id').deferrable('deferred').onDelete('CASCADE')
      table.string('fault').notNullable()
      table.string('corrective_action')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('faults', table => {
      table.dropForeign('vehicle_id')
  })
    .then(() => {
        return knex.schema.dropTableIfExists('faults')
    })
};
