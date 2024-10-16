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
#COPY frontend/app_folder/node_modules node_modules
#COPY frontend/app_folder/public public
#COPY frontend/app_folder/server server
#COPY frontend/app_folder/package.json .
#COPY frontend/app_folder/package-lock.json . 
COPY frontend/node_modules node_modules
COPY frontend/public public
COPY frontend/server server
COPY frontend/package.json .
COPY frontend/package-lock.json .

COPY frontend/src src

# Define the command to run your application
CMD ["npm", "start"]