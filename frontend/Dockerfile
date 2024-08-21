# Use an official Node.js runtime as a base image
FROM node:14

ARG PROJECT_PATH
ENV PROJECT_PATH=$PROJECT_PATH
ARG PATH_TO_TLS
ENV PATH_TO_TLS=$PATH_TO_TLS

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY $PROJECT_PATH/frontend/package*.json ./

# Copy cert stuff
COPY $PATH_TO_TLS tls

# Install dependencies
RUN npm install --lockfile-version 3 --package-lock-only

# Copy the application code to the container
COPY $PROJECT_PATH/frontend/ .

# The .env file holds the location of the crts etc.

# Define the command to run your application
CMD ["npm", "start"]
