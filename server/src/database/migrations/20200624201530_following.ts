import * as Knex from 'knex';


export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('following', (table) => {
    table.increments().primary();
    table.integer('userId').notNullable().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
    table.integer('followId').notNullable().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
  });
}


export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('following');
}
