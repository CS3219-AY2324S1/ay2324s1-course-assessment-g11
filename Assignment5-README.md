Note: This assumes you are running Mac or Linux. If you are running Windows, please run all commands on a Git Bash terminal, or use Windows Subsystem for Linux.

To run our app on Docker:

1. Ensure depedencies are installed correctly (see [README.md](README.md))
    1.1 Install the latest version of node.js v18
    1.2 Install the latest version of yarn (`npm install -g yarn`)
    1.3 Install the latest version of docker
2. Create a `.env` file at the project root and copy the environment secrets from the uploaded file on CANVAS.
3. Start the app using `source start-app-with-docker.sh`
4. Open your browser and go to `localhost:3000`
