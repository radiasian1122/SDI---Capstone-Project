/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("users_roles", (table) => {
    table.integer("user_id").notNullable();
    table
      .foreign("user_id")
      .references("users.dod_id")
      .deferrable("deferred")
      .onDelete("CASCADE");
    table.integer("role_id").notNullable();
    table
      .foreign("role_id")
      .references("roles.role_id")
      .deferrable("deferred")
      .onDelete("CASCADE");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .alterTable("users_roles", (table) => {
      table.dropForeign("user_id").dropForeign("role_id");
    })
    .then((table) => {
      return knex.schema.dropTableIfExists("users_roles");
    });
};
