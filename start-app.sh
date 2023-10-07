#!/bin/sh

# These are the steps needed for docker to function

# Step 1: Build the root-level Dockerfile
docker build -t peerprep-base -f Dockerfile .

# Step 2: Build the docker-compose services
dotenv -e .env docker-compose build

# Step 3: Run the entire application
docker-compose up

