/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const hasTable = await knex.schema.hasTable("urls");
  
  if (hasTable)
    return;

  await knex.schema.createTable("urls", (table) => {
    table.increments("id").primary();
    table.string("redirect_url").notNullable();
    table.string("shortened_url").notNullable();
    table.string("slug").notNullable().unique();
    table.timestamp("expiration_date").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("urls");
};
