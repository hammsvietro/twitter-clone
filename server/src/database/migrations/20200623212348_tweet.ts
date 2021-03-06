import * as Knex from 'knex';


export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('tweets', (table) => {
    table.increments().primary();
    table.integer('userId').notNullable().references('id').inTable('users');
    table.integer('mainTweetId').references('id').inTable('tweets');
    table.text('content').notNullable();
    table.bigInteger('replies').defaultTo(0);
    table.bigInteger('retweets').defaultTo(0);
    table.bigInteger('likes').defaultTo(0);
    table.boolean('isReply').defaultTo(false).notNullable();
    table.dateTime('time').defaultTo(knex.fn.now()).notNullable();
    table.string('attachment');
    table.boolean('hasAttachment').notNullable().defaultTo(false);
  });
}


export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('tweets');
}
