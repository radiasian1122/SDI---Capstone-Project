/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("driver_quals").del();
  await knex("driver_quals").insert([
    { id: 1, platform: "JLTV", variant: "some-variant" },
    { id: 2, platform: "1.1", variant: "some-variant" },
    { id: 3, platform: "STRYKER", variant: "some-variant" },
    { id: 4, platform: "MRZR", variant: "some-variant" },
    { id: 5, platform: "ISV", variant: "some-variant" },
    { id: 6, platform: "LMTV", variant: "some-variant" },
    { id: 7, platform: "TLC", variant: "some-variant" },
    { id: 8, platform: "RFSS", variant: "some-variant" },
    { id: 9, platform: "QUAD", variant: "some-variant" },
  ]);
};
