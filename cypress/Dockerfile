FROM cypress/included:12.14.0

WORKDIR /e2e

COPY package.json ./package.json
RUN npm install
#COPY cypress ./cypress
RUN mkdir cypress
#RUN mkdir cypress/support
#RUN mkdir cypress/integratio
COPY support cypress/support
COPY tls tls
COPY integration cypress/integration
COPY cypress.config.js ./cypress.config.js

#ENTRYPOINT ["bash"]
ENTRYPOINT ["npx", "cypress", "run"]
#ENTRYPOINT ["npx", "cypress", "open"]