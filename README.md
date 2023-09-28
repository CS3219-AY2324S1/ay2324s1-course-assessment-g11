[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/6BOvYMwN)

## PeerPrep Monorepo User Guide

Prerequisites for PeerPrep Monorepo:

1.  **Yarn:** Ensure you have the latest version of Yarn installed. Yarn
    Workspaces is available in Yarn v1.0 and later.
2.  Installation (if not already installed):

    ```bash
    npm install -g yarn
    ```

3.  **Node.js:** Check each application's documentation for the recommended
    Node.js version.
4.  **Git (Optional but Recommended):**
5.  **Docker (If deploying with Docker):**
6.  **Kubernetes Tools (If deploying with Kubernetes):**

---

Adjust these prerequisites based on the specific requirements of
your services / frontend.

### Structure:

```
/peerprep
├── /services
│   ├── /admin-service (express application)
│   ├── /user-service (express application)
│   ├── /matching-service (express application)
│   ├── /question-service (express application)
│   └── /collaboration-service (express application)
├── /frontend
│   └── /pages for peerprep (NextJs application)
├── /deployment
│   ├── /docker
│   └── /kubernetes
└── README.md (and other root-level files & docs)
```

### Getting Started - Local Development:

1. **Installing Dependencies:** From the root directory (`/peerprep`), run:

   ```bash
   yarn install
   ```

   or

   ```bash
   yarnpkg install
   ```

   (if you have hadoop yarn installed)

   This command will install dependencies for all services and the frontend in a
   centralized `node_modules` directory at the root.

1. **Adding Dependencies:** To add a dependency to a specific workspace (e.g.,
   `user-service`), use:

   ```bash
   yarn workspace user-service add [dependency-name]
   ```

1. **Initializing Prisma:** In the root file, run the following:

   ```bash
   yarn prisma generate ## Do this whenever we change the models in schema.prisma
   ```

1. **Running Backend Scripts:** To run a script specific to a workspace (e.g.,
   the `start` script for `user-service`), use:

   ```bash
   yarn workspace user-service start
   ```

1. **Running Frontend Scripts:** To run the frontend cod, use:

   ```bash
   yarn workspace frontend dev ## For development

   # or

   yarn workspace frontend build ## For first time setup run the build command
   yarn workspace frontend start ## For subsequent runs
   ```

### Getting Started - Docker:

1. **Run the start-app.sh script:** From the root repo, run

```bash
./start-app.sh # on mac / linus

# or

start-app.sh # on windows
```

2. Made a change in code? To refresh containers, run

```bash
docker-compose up --force-recreate --build -d
docker image prune -f
```

### Notes:

- After setting up Yarn Workspaces, any `node_modules` directories in individual
  services or applications can be safely removed.
- Always ensure thorough testing after adding or updating dependencies to ensure
  all parts of the system function as expected.

### Prisma Notes

Next steps:

1. Set the DATABASE_URL in the .env file to point to your existing database. If
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
* `.firebaserc` - The Firebase project definitions
* `firebase.json` - The emulators that are used

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
