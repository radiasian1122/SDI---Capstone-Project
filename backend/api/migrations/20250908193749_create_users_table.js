/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.integer("dod_id").unique().notNullable().primary();
    table.string("username");
    table.string("password");
    table.string("uic").notNullable();
    table
      .foreign("uic")
      .references("units.uic")
      .deferrable("deferred")
      .onDelete("CASCADE");
    table.string("first_name").notNullable();
    table.string("last_name").notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .alterTable("users", (table) => {
      table.dropForeign("uic");
    })
    .then(() => {
      return knex.schema.dropTableIfExists("users");
    });
};
