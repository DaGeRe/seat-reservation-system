# Use an official Node.js runtime as a base image
FROM node:14

ARG PROJECT_PATH
ENV PROJECT_PATH=$PROJECT_PATH
ARG PATH_TO_TLS
ENV PATH_TO_TLS=$PATH_TO_TLS

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory first
# This ensures that the npm install step is only re-run if these files change
COPY $PROJECT_PATH/frontend/package*.json ./

# Install dependencies
RUN npm config set https-proxy http://proxy.justiz.sachsen.de:3128 && npm config set proxy http://proxy.justiz.sachsen.de:3128 && npm install --lockfile-version 3

# Copy cert stuff
COPY $PATH_TO_TLS tls

# Copy the rest of the application code
COPY $PROJECT_PATH/frontend/ .

# Install MUI icons (consider putting this in package.json)
#RUN npm config set https-proxy http://proxy.justiz.sachsen.de:3128 && npm config set proxy http://proxy.justiz.sachsen.de:3128 && npm install @mui/icons-material
RUN npm config set https-proxy http://proxy.justiz.sachsen.de:3128 && npm config set proxy http://proxy.justiz.sachsen.de:3128 && npm install @mui/icons-material

# Define the command to run your application
CMD ["npm", "start"]