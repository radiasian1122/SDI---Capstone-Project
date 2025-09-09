/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('dispatches', table => {
      table.increments('dispatch_id')
      table.bigint("user_id")
      table.foreign('user_id').references('users.dod_id').deferrable('deferred')
      table.integer("vehicle_id")
      table.foreign('vehicle_id').references('vehicles.vehicle_id').deferrable('deferred').onDelete('CASCADE')
      table.boolean('approved').notNullable()

  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('dispatches', table => {
      table.dropForeign('user_id')
      table.dropForeign('vehicle_id')
  })
      .then(() => {
          return knex.schema.dropTableIfExists('dispatches')
      })
};
