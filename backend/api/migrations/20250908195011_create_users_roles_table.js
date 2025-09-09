/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users_roles', function (table) {
    table.increments('id').primary();
    table.string('user_id').notNullable();
    table.foreign('user_id').references('dod_id').inTable('users').onDelete('CASCADE');
    table.integer('role_id').notNullable();
    table.foreign('role_id').references('role_id').inTable('roles').onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('users_roles');
};
