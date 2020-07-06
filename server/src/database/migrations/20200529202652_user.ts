
import Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('users', (table) => {
    table.increments().primary();
    table.string('name').notNullable();
    table.string('username').notNullable().unique();
    table.string('email').notNullable().unique();
    table.string('password');
    table.string('profilePhoto');
    table.string('profilePhotoThumbnail');
    table.bigInteger('followers').notNullable().defaultTo(0);
    table.bigInteger('following').notNullable().defaultTo(0);
    table.boolean('darkThemeActive').defaultTo(false).notNullable();

  });
}


export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('users');
}
