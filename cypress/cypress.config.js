const { defineConfig } = require('cypress');

module.exports = defineConfig({
  clientCertificates: [
  {
    //url: 'https://jus-srv-test30.justiz.sachsen.de:3001',
    url: 'https://frontend:3001',
    ca:[],
    certs: [
      {
        cert: 'tls/jus-srv-test30.justiz.sachsen.de.crt',
        key: 'tls/jus-srv-test30.justiz.sachsen.de.pk.un_encrypted.pem',
      },
  ]
  }],
  e2e: {
    //baseUrl: 'https://jus-srv-test30.justiz.sachsen.de:3001', // Update to match your app's URL in Docker
    baseUrl: 'https://frontend:3001',
    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(message);
          return null; // Return null since tasks need to return something
        },
      });
      // Implement node event listeners here if needed
    },
    specPattern: 'cypress/integration/**/*.cy.{js,jsx,ts,tsx}', // New pattern for test files
    supportFile: false, 
    //supportFile: 'cypress/support/index.js', // Support file location
  },
  video: false,
});
