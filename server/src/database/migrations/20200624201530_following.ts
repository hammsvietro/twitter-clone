import * as Knex from 'knex';


export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('following', (table) => {
    table.increments().primary();
    table.integer('userId').notNullable().references('id').inTable('users');
    table.integer('followingId').notNullable().references('id').inTable('users');
  });
}


export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('following');
}
