import * as Knex from 'knex';


export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('retweets', (table) => {
    table.increments().primary();
    table.bigInteger('tweetId').references('id').inTable('tweets').onDelete('CASCADE').onUpdate('CASCADE');
    table.bigInteger('retweetUserId').references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');
    table.boolean('isQuote').notNullable().defaultTo('false');
    table.text('quote');
  });
}


export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('retweets');
}
