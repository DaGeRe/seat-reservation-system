FROM cypress/included:12.14.0

WORKDIR /e2e

COPY package.json ./package.json
RUN npm install
#COPY cypress ./cypress
RUN mkdir cypress
RUN mkdir cypress/support
COPY support/index.js ./cypress/support/index.js
COPY cypress.config.js ./cypress.config.js


ENTRYPOINT ["npx", "cypress", "run"]