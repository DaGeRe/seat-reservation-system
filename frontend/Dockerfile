# Use an official Node.js runtime as a base image
FROM node:14

# Set environment variables for project and TLS paths
ARG PROJECT_PATH
ARG PATH_TO_TLS
ENV PROJECT_PATH=${PROJECT_PATH}
ENV PATH_TO_TLS=${PATH_TO_TLS}

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY ${PROJECT_PATH}/frontend/package*.json ./

# Install all dependencies, including @mui/icons-material
RUN npm install --lockfile-version 3 --package-lock-only
RUN npm install @mui/icons-material

# Copy cert stuff
COPY ${PATH_TO_TLS} ./tls

# Copy the application code to the container
COPY ${PROJECT_PATH}/frontend/ ./

# Define the command to run your application
CMD ["npm", "start"]