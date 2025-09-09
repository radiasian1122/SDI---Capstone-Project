/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('vehicles', table => {
      table.increments('vehicle_id')
      table.string('uic')
      table.foreign('uic').references('units.uic').deferrable('deferred')
      table.integer('platform_variant').notNullable()
      table.foreign('platform_variant').references('qualifications.qual_id').deferrable('deferred').onDelete('CASCADE')
      table.string('bumper_no').notNullable()
      table.boolean('deadlined').notNullable()
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('vehicles', table =>{
      table.dropForeign('uic')
  })
      .then(() => {
          return knex.schema.dropTableIfExists('vehicles')
      })
};
