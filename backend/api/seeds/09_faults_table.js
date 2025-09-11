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
            fault_code: 123,
            fault_description: 'It broke dawg',
            tech_status: 'Ordered the part 6 months ago',
            corrective_action: 'I tried to fix it but nah'
        }
    );
};
