#!/bin/sh

# These are the steps needed for docker to function

# Step 1: Build the root-level Dockerfile and docker-compose services
yarn docker:build

# Step 2: Run the entire application
yarn docker:devup
