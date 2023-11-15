# User Service

## Pre-requisites:
You need to set the environment variable `PRISMA_DATABASE_URL` in `prisma/schema.prisma`. 

If you do so with an `.env` file, you need to generate the prisma client/migrate prisma as follows:

```
yarn global add dotenv-cli # This is needed at the root of the project

# The command must be prefixed with dotenv
dotenv -e .env {insert the command here}
```

## How to run and develop locally:

Steps 1 and 2 are only compulsory if you are using a database on a locally-hosted Docker container:

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

2) Access the database using:

```
docker exec -it some-postgres psql -u {insert username here} -D {insert database name here}
```

3) To start the user-service, from the root of the entire project, run the command:
```
yarn workspace user-service dev:local
```

4) The user-service will run on port 5001. You can test the API using Postman

## How to run automated tests:

### Unit Testing
In unit testing, each file is tested in isolation. 
For example, while API routes are normally connected to the Prisma client functions, during unit testing, the API routes will be connected to a mock Prisma client.

From the root of the project directory, run:
```
yarn workspace user-service test
```

There is no need to set up a database for unit testing as mocking the database is done using [Vitest](https://vitest.dev/) and [vitest-mock-extended](https://www.npmjs.com/package/vitest-mock-extended).

The above command can also be run in a CI workflow.

### System Testing
In system testing, the entire microservice (including a real but temporary database) is run with all the components working together.

From the root of the project directory, run:
```
yarn workspace user-service systemtest
```

What this command does:
1) Read in a secret file stored in `user-service/systemtest/secrets/.env.user-service-system-test` to use as environment variables
2) Setup a Docker container for the temporary database
3) Apply Prisma migrations to that container using `yarn prisma migrate deploy`
4) Run the system test files
5) Teardown the Docker container

You need to pass in the following environment variables through the above-mentioned `.env`-type file:
```
PRISMA_DATABASE_URL="postgresql://postgres:${password}@localhost:5430/peerprepdb-user-service-systemtest?schema=public"
PRISMA_DATABASE_PASSWORD="${The password you want to pass in. This must match the password in the above variable}"
```

If you want to run this in a CI workflow, run:
```
yarn workspace user-service systemtest:ci
```

This would do everything above except reading the environment variables from the `.env`-type file.
This also means that you need to pass in the environment variables to the CI workflow separately.

#### Warning about system tests
During system testing, a live database is used (although it only exists for the duration of the test).

In the current implementation of system test, the database is never cleared during the entire testing process, meaning that each test depends on the state of the previous test.

This also means that if you abort the system test (or it fails), re-running the system test is not guaranteed to succeed again after fixing the failure cause.

To be safe, any time the system test fails or is otherwise aborted, run:
```
yarn workspace user-service systemtest:docker:down
```
and then re-run:
```
yarn workspace user-service systemtest
```
