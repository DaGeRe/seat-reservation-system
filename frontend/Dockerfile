# Use an official Node.js runtime as a base image
FROM node:18
ENV NODE_ENV=production
# Set environment variables for project and TLS paths
ARG PROJECT_PATH
ARG PATH_TO_TLS
ENV PROJECT_PATH=${PROJECT_PATH}
ENV PATH_TO_TLS=${PATH_TO_TLS}

RUN apt-get update
RUN apt-get install -y net-tools
#  && DEBIAN_FRONTEND=noninteractive apt-get install -y \
#    net-tools \

# Set the working directory in the container
WORKDIR /usr/src/app

COPY tls tls
COPY public public
COPY server server
COPY node_modules node_modules



COPY package.json .
COPY package-lock.json .
COPY run_test.sh .
COPY .babelrc .
COPY jest.config.js .
COPY jest.setup.js .
RUN chmod +x run_test.sh
COPY src src

# Define the command to run your application
CMD ["npm", "start"]