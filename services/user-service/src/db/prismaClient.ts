import {PrismaClient} from '@prisma/client';

const prismaClient : PrismaClient = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

export default prismaClient;
