# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock files
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install
RUN yarn prisma generate
