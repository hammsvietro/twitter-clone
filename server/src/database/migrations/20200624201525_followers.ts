import * as Knex from 'knex';


export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('followers', (table) => {
    table.increments().primary();
    table.integer('userId').notNullable().references('id').inTable('users');
    table.integer('followerId').notNullable().references('id').inTable('users');
  });
}


export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('followers');
}
