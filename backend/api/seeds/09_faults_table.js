/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await knex('faults').del()
    await knex('faults').insert(
        {
            vehicle_id: 1,
            fault: 'some-fault',
            corrective_action: 'some-corrective-action'
        }
    );
};
