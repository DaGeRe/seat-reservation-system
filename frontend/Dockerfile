# Use an official Node.js runtime as a base image
FROM node:22
ENV NODE_ENV=production
ARG PROJECT_PATH
ARG PATH_TO_TLS
ENV PROJECT_PATH=${PROJECT_PATH}
ENV PATH_TO_TLS=${PATH_TO_TLS}

#RUN apt-get update
#RUN apt-get install -y net-tools

WORKDIR /usr/src/app

COPY tls tls
COPY public public
#COPY server server
#COPY node_modules node_modules



COPY package.json .
#COPY package-lock.json .

RUN npm config set registry http://registry.npmjs.org/
RUN npm config set https-proxy http://proxy.justiz.sachsen.de:3128
RUN npm config set proxy http://proxy.justiz.sachsen.de:3128
RUN npm i

COPY src src

CMD ["npm", "start"]