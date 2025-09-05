# --- Stage 1: Builder ---
FROM node:22-slim AS builder
ENV NODE_ENV=production

WORKDIR /usr/src/app

############################################################################
# Important to define variables for build time, not just run time          #
# E.g.: process.env.REACT_APP_BACKEND_URL will be substituted at buildtime #
############################################################################
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

ARG REACT_APP_ERROR_USER_NOT_FOUND_IN_AD
ENV REACT_APP_ERROR_USER_NOT_FOUND_IN_AD=$REACT_APP_ERROR_USER_NOT_FOUND_IN_AD

ARG REACT_APP_ERROR_USER_NOT_FOUND_IN_DAO
ENV REACT_APP_ERROR_USER_NOT_FOUND_IN_DAO=$REACT_APP_ERROR_USER_NOT_FOUND_IN_DAO

ARG REACT_APP_ERROR_WRONG_PW
ENV REACT_APP_ERROR_WRONG_PW=$REACT_APP_ERROR_WRONG_PW

ARG TARGET

# Copy needed packages.
COPY package.json package-lock.json* ./
# Proxy stuff to install packages
RUN npm config set registry http://registry.npmjs.org/
RUN npm config set https-proxy http://proxy.justiz.sachsen.de:3128
RUN npm config set proxy http://proxy.justiz.sachsen.de:3128

# Dependencies installing
RUN npm ci --omit=dev

# Cp source
COPY public public
COPY src src

RUN if [ "$TARGET" = "production_runtime" ]; then \
        npm run build; \
    fi

# Small image to serve the builded bundle
FROM nginx:alpine AS production_runtime

# Copy SSL files
COPY tls/jus-srv-test30.justiz.sachsen.de.crt /etc/ssl/certs/jus-srv-test30.justiz.sachsen.de.crt
COPY tls/jus-srv-test30.justiz.sachsen.de.pk.un_encrypted.pem /etc/ssl/private/jus-srv-test30.justiz.sachsen.de.pk.un_encrypted.pem

# The config for https etc.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Builded react file will be served as static site by nginx.
COPY --from=builder /usr/src/app/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]

FROM node:22 AS development_runtime
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

ARG REACT_APP_ERROR_USER_NOT_FOUND_IN_AD
ENV REACT_APP_ERROR_USER_NOT_FOUND_IN_AD=$REACT_APP_ERROR_USER_NOT_FOUND_IN_AD

ARG REACT_APP_ERROR_USER_NOT_FOUND_IN_DAO
ENV REACT_APP_ERROR_USER_NOT_FOUND_IN_DAO=$REACT_APP_ERROR_USER_NOT_FOUND_IN_DAO

ARG REACT_APP_ERROR_WRONG_PW
ENV REACT_APP_ERROR_WRONG_PW=$REACT_APP_ERROR_WRONG_PW

WORKDIR /usr/src/app
COPY tls tls
ENV PORT=443
ENV HTTPS=true
COPY --from=builder /usr/src/app/ .
CMD ["npm", "start" ]
