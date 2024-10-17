# Use an official Node.js runtime as a base image
FROM node:14

# Set environment variables for project and TLS paths
ARG PROJECT_PATH
ARG PATH_TO_TLS
ENV PROJECT_PATH=${PROJECT_PATH}
ENV PATH_TO_TLS=${PATH_TO_TLS}

# Set the working directory in the container
WORKDIR /usr/src/app

COPY tls tls
COPY public public
COPY server server
COPY node_modules node_modules


COPY package.json .
COPY package-lock.json .

COPY src src

# Define the command to run your application
CMD ["npm", "start"]