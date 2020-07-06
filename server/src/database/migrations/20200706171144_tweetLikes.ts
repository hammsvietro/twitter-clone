import * as Knex from 'knex';


export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('tweetLikes', (table) => {
    table.increments().primary();
    table.bigInteger('userId').references('id').inTable('users').notNullable();
    table.bigInteger('tweetId').references('id').inTable('tweets').notNullable();
  });
}


export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('tweetLikes');
}
