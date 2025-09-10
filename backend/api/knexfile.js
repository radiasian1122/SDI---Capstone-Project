// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: 'convoy_connect',
      user: 'postgres',
      password: 'docker',
      host: 'localhost',
      port: 5432
    }
  },
    docker: {
        client: "pg",
        connection: "pg://postgres:docker@db:5432/convoy_connect",
    },
};
