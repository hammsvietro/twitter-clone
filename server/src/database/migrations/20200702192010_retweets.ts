import * as Knex from 'knex';


export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('retweets', (table) => {
    table.increments().primary();
    table.bigInteger('tweetId').references('id').inTable('tweets');
    table.bigInteger('userId').references('id').inTable('users');
    table.boolean('isQuote').notNullable().defaultTo('false');
  });
}


export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('retweets');
}
