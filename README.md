[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/6BOvYMwN)

## Assignment 4 README

Prerequisites for PeerPrep Assignment 4:

1. **Yarn:** Ensure you have the latest version of Yarn installed. Yarn
   Workspaces is available in Yarn v1.0 and later.
2. Installation (if not already installed):

   ```bash
   npm install -g yarn
   ```

3. **Node.js:** Check each application's documentation for the recommended
   Node.js version.
4. **Git**
5. **Docker**
6. **Postman** or any other REST API testing tool (if testing any APIs)

---

Adjust these prerequisites based on the specific requirements of
your services / frontend.

### Structure:

```
/peerprep
├── /services
│   ├── /admin-service (express application)
│   ├── /user-service (express application)
│   ├── /question-service (express application)
├── /frontend
├── .env (not in git)
├── .env.firebase_emulators_test (not in git)
└── README.md (and other root-level files & docs)
```

### Getting Started - Local Development:

1. Ensure that you have an `.env` file at the root directory with the following variables:
   `bash
   PRISMA_DATABASE_URL=<redacted>
   MONGO_ATLAS_URL=<redacted>
   FIREBASE_SERVICE_ACCOUNT=<redacted>
   NEXT_PUBLIC_FRONTEND_FIREBASE_CONFIG={"apiKey": <redacted>,"authDomain": <redacted>,"projectId": <redacted>,"storageBucket": <redacted>,"messagingSenderId": <redacted>,"appId": <redacted>}
   `
   Note: For `NEXT_PUBLIC_FRONTEND_FIREBASE_CONFIG`, the JSON should not have newlines since Next.js may not process it correctly.
   The difference between it and `FIREBASE_SERVICE_ACCOUNT` are shown below:

| Variable                             | Purpose                                           |
| ------------------------------------ | ------------------------------------------------- |
| FIREBASE_SERVICE_ACCOUNT             | For backend verification and administrative tasks |
| NEXT_PUBLIC_FRONTEND_FIREBASE_CONFIG | For the frontend to connect to Firebase           |

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

4. **Running Scripts:** run:

```bash
./start-app-with-docker.sh # on mac / linux

# You can also use the above command on Windows with Git Bash
```

This will create new Docker images everytime it is run. Be careful of how much disk space you have left.

Note: Even though services are containerised, they are still accessed from the browser/API testing tool using
```http://localhost:<insert port number here>```

Aternatively, you can run the below scripts (this also works on Windows Command Line):
```bash
yarn docker:build # Not needed if you have built the images already and did not update the source code afterwards
yarn docker:devup
```

5. **Login using the provided GitHub account:** The details of the GitHub account to use for testing Assignment 4 are 
uploaded in CANVAS.

6. **Once done, run yarn docker:devdown:** From the root repo, run

```bash
yarn docker:devdown
```

This will stop and delete all the containers.

### Prisma Notes

Next steps:

1. Set the PRISMA_DATABASE_URL in the .env file to point to your existing database. If
   your database has no tables yet, read https://pris.ly/d/getting-started
2. Set the provider of the datasource block in schema.prisma to match your
   database: postgresql, mysql, sqlite, sqlserver, mongodb or cockroachdb.
3. Run prisma db pull to turn your database schema into a Prisma schema.
4. Run prisma generate to generate the Prisma Client. You can then start
   querying your database.
