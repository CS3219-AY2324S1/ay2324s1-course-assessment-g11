# User Service

## Pre-requisites:
You need to set the environment variable `DATABASE_URL` in `prisma/schema.prisma`. 

If you do so with an `.env` file, you need to generate the prisma client/migrate prisma as follows:

```
yarn global add dotenv-cli

# The command must be prefixed with dotenv
dotenv -e .env {insert the command here}
```

## How to run locally:

1) Start the database with the below command:

```
docker run --name some-postgres -e POSTGRES_USER={insert username here} -e POSTGRES_DB={insert database name here} -e POSTGRES_PASSWORD={insert password here} -p 5432:5432 -d postgres 
```
The POSTGRES environment variables should match the database URL you are using for your Prisma schema.

For the port mapping, `-p 5432:5432`, if you are running a local instance of PostgreSQL, you may substitute the left port number (host) with something else. Example:
```
-p 5431:5432
```
The host port of 5431 is mapped to container port of 5432. Note that your host port must match the database URL you are using for your Prisma schema.

1) Access the database using:

```
docker exec -it some-postgres psql -u {insert username here} -D {insert database name here}
```

1) To start the user-service, from the root of the entire project, run the command:
```
yarn workspace user-service start
```

1) The user-service will run on port 5001. You can test the API using Postman
