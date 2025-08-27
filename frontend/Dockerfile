FROM node:22-slim
ENV NODE_ENV=production
ARG PROJECT_PATH
ARG PATH_TO_TLS
ENV PROJECT_PATH=${PROJECT_PATH}
ENV PATH_TO_TLS=${PATH_TO_TLS}

WORKDIR /usr/src/app

COPY tls tls
COPY public public
COPY package.json .

RUN npm config set registry http://registry.npmjs.org/
RUN npm config set https-proxy http://proxy.justiz.sachsen.de:3128
RUN npm config set proxy http://proxy.justiz.sachsen.de:3128
#RUN npm install -g depcheck npm-check

RUN npm i --omit=dev

# Rm useless stuff.
RUN npm cache clean --force && rm -rf /tmp/*

COPY src src

CMD ["npm", "start", "&&", "rm  -r /root/.npm/_logs" ]