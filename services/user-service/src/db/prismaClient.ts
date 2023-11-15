import {PrismaClient} from '@prisma/client';

const prismaClient : PrismaClient = new PrismaClient({
  datasourceUrl: process.env.PRISMA_DATABASE_URL
});

export default prismaClient;
