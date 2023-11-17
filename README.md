[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/6BOvYMwN)

## Assignment 2 README

Prerequisites for PeerPrep Assignment 2:

1. **Yarn:** Ensure you have the latest version of Yarn installed. Yarn
   Workspaces is available in Yarn v1.0 and later.
2. Installation (if not already installed):

   ```bash
   npm install -g yarn
   ```

3. **Node.js:** Check each application's documentation for the recommended
   Node.js version.
4. **Git**
5. **Dotenv** - `yarn global add dotenv` - This is used to open the services
6. **Postman** or any other REST API testing tool (optional)

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

4. **Running Scripts:** On separate tabs, run the following scripts:

   ```bash
   yarn workspace user-service dev:local
   yarn workspace question-service dev:local
   yarn workspace frontend dev:local
   ```

   You may also run `yarn workspace admin-service dev:local` if you want to set/remove admin permissions on a user but
   otherwise, this is not necessary since admin verification is done within the respective services.

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

### Firebase Local Emulator Suite

The [Firebase Local Emulator Suite](https://firebase.google.com/docs/emulator-suite) is used to support
automated testing of any Firebase-related functionality.

The following files at the project root define the Firebase project as well as the emulators used:

- `.firebaserc` - The Firebase project definitions
- `firebase.json` - The emulators that are used

For local testing, the file used for passing in environment variables has to be named:

```
.env.firebase_emulators_test
```

This file should contain the following environment variables:

```
FIREBASE_AUTH_EMULATOR_HOST="127.0.0.1:9099"
FIREBASE_SERVICE_ACCOUNT={insert secret JSON value here}
```

In the CI environment, the environment variables have to be defined separately.
For example, FIREBASE_SERVICE_ACCOUNT will be passed in as a secret on GitHub Actions.
