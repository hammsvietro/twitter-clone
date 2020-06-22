
import Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('users', (table) => {
    table.increments();
    table.string('name').notNullable();
    table.string('username').notNullable().unique();
    table.string('email').notNullable().unique();
    table.string('password').unique();
    table.string('profilePhoto').unique();
    table.boolean('darkThemeActive').defaultTo(false).notNullable();

  });
}


export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('users');
}
