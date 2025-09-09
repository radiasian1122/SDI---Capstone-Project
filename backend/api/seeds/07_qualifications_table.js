/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("table_name").del();
  await knex("table_name").insert([
    { platform: "JLTV", variant: "some-variant" },
    { platform: "1.1", variant: "some-variant" },
    { platform: "STRYKER", variant: "some-variant" },
    { platform: "MRZR", variant: "some-variant" },
    { platform: "ISV", variant: "some-variant" },
    { platform: "LMTV", variant: "some-variant" },
    { platform: "TLC", variant: "some-variant" },
    { platform: "RFSS", variant: "some-variant" },
    { platform: "QUAD", variant: "some-variant" },
  ]);
};
