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
  }
};
