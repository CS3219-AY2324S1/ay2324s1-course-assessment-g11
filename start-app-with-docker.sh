#!/bin/sh

# These are the steps needed for docker to function

# Step 1: Build the root-level Dockerfile and docker-compose services
yarnpkg docker:build

# Step 2: Run the entire application
yarnpkg docker:devup
