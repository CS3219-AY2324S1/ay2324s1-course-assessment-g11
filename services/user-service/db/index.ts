import { Client, Pool, QueryResult } from "pg";
import { PrismaClient } from "@prisma/client";
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

const pool_query = (text: string, params: any, callback: (err: Error, result: QueryResult<any>) => void) => {
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

export const client_query = async (text: string, params: any[], callback: (err: Error, result: QueryResult<any>) => void) => {
  await client.connect();
  const result = client.query(text, params, callback);
  await client.end();
  return result;
};

export const query = pool_query;
