import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.test.env' : '.env'
});


export const databases = {
  development: {
    client: 'pg', 
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      port: 5432 || process.env.DB_PORT,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: 'src/database/migrations',
    },
  },
  test: {
    client: process.env.DB_DIALECT || 'sqlite',
    connection: {
      filename: './__tests__/database.sqlite',
    },
    migrations: {
      directory: 'src/database/migrations',
    },
    useNullAsDefault: true,
  }
};



const chosen = process.env.NODE_ENV === 'test' ? databases.test : databases.development;

export const config = chosen;


export default knex(chosen);
