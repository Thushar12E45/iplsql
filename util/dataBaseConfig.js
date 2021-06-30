const { Client } = require('pg');
const { Pool } = require('pg');

const dbName = 'ipl';
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: `${dbName}`,
  password: 'abc@123',
  port: 5432,
});

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: `${dbName}`,
  password: 'abc@123',
  port: 5432,
});

client.on('connect', () => {
  console.log(`Connected to DataBase ${dbName}`);
});

client.on('end', () => {
  console.log(`Diconnected from DataBase ${dbName}`);
});

pool.on('connect', () => {
  console.log(`Connected to DataBase ${dbName}`);
});

pool.on('commit', () => {
  console.log(`Diconnected from DataBase ${dbName}`);
});
module.exports = { client, pool };
