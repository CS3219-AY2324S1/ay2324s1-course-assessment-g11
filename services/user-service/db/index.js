const { Client, Pool } = require("pg");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const users = prisma.user.findMany();
console.log(JSON.stringify(users));

// With pooling
const pool = new Pool({
  user: "dbuser",
  host: "localhost",
  database: "user_db",
  password: "password",
  port: 5432,
});

const pool_query = (text, params, callback) => {
  return pool.query(text, params, callback);
};

// Without pooling
const client = new Client({
  user: "dbuser",
  host: "localhost",
  database: "user_db",
  password: "password",
  port: 5432,
});

const client_query = async (text, params, callback) => {
  await client.connect();
  const result = client.query(text, params, callback);
  await client.end();
  return result;
};

const query = pool_query;

module.exports = {
  query,
  client_query,
};
