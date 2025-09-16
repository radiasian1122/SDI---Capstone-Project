/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('driver_quals', table => {
      table.increments()
      table.bigint('user_id')
      table.foreign('user_id').references('users.dod_id').deferrable('deferred')
      table.integer('qual_id')
      table.foreign('qual_id').references('qualifications.qual_id').deferrable('deferred').onDelete('CASCADE')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('driver_quals', table => {
      table.dropForeign('user_id')
      table.dropForeign('qual_id')
  })
      .then(() => {
          return knex.schema.dropTableIfExists('driver_quals')
      })
};
