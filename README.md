[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/6BOvYMwN)

## Assignment 1

Prerequisites for PeerPrep Monorepo:

1. **Yarn:** Ensure you have the latest version of Yarn installed. Yarn
    Workspaces is available in Yarn v1.0 and later.
2. Installation (if not already installed):

    ```bash
    npm install -g yarn
    ```

3. **Node.js:** Check each application's documentation for the recommended
    Node.js version.
4. **Git (Optional but Recommended):**

### Getting Started - Local Development:

1. **Installing Dependencies:** From the root directory, run:

   ```bash
   cd spa
   yarn install
   ```

   This command will install dependencies for all services and the frontend in a
   centralized `node_modules` directory at the root.

2. **Adding Dependencies:** To add a dependency to a specific workspace (e.g.,
   `frontend`), use:

   ```bash
   yarn workspace frontend add [dependency-name]
   ```

3. **Running Frontend Scripts:** To run the frontend cod, use:

   ```bash
   yarn workspace frontend dev ## For development

   # or

   yarn workspace frontend build ## For first time setup run the build command
   yarn workspace frontend start ## For subsequent runs
   ```
