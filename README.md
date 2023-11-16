[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/6BOvYMwN)

## Assignment 1 README

Prerequisites for PeerPrep Assignment 1:

1. **Yarn:** Ensure you have the latest version of Yarn installed. Yarn
   Workspaces is available in Yarn v1.0 and later.
2. Installation (if not already installed):

   ```bash
   npm install -g yarn
   ```

3. **Node.js:** Check each application's documentation for the recommended
   Node.js version.
4. **Git**
5. **Postman** or any other REST API testing tool (optional)

---

Adjust these prerequisites based on the specific requirements of
your services / frontend.

### Structure:

```
/peerprep
├── /services
│   └── /question-service (express application)
├── /frontend
├── .env (not in git)
├── .env.firebase_emulators_test (not in git)
└── README.md (and other root-level files & docs)
```

### Getting Started - Local Development:

1. Ensure that you have an `.env` file at the root directory with the following variables:
   `bash
   MONGO_ATLAS_URL=<redacted>
   `

Copy the environment secrets from the uploaded file on CANVAS.


2. **Installing Dependencies:** From the root directory (`/peerprep`), run:

   ```bash
   yarn install --frozen-lockfile
   ```

   or

   ```bash
   yarnpkg install --frozen-lockfile
   ```

   (if you have hadoop yarn installed)

3. **Initializing Prisma:** In the root file, run the following:

   ```bash
   yarn prisma generate ## Do this whenever we change the models in schema.prisma
   ```

4. **Running Scripts:** On separate tabs, run the following scripts:

   ```bash
   yarn workspace question-service dev:local
   yarn workspace frontend dev:local
   ```

### Prisma Notes

Next steps:

1. Set the PRISMA_DATABASE_URL in the .env file to point to your existing database. If
   your database has no tables yet, read https://pris.ly/d/getting-started
2. Set the provider of the datasource block in schema.prisma to match your
   database: postgresql, mysql, sqlite, sqlserver, mongodb or cockroachdb.
3. Run prisma db pull to turn your database schema into a Prisma schema.
4. Run prisma generate to generate the Prisma Client. You can then start
   querying your database.

```

```
