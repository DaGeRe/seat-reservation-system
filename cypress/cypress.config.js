const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://frontend:3001', // Update to match your app's URL in Docker
    setupNodeEvents(on, config) {
      // Implement node event listeners here if needed
    },
    specPattern: 'cypress/integration/**/*.cy.{js,jsx,ts,tsx}', // New pattern for test files
    supportFile: false, 
    supportFile: 'cypress/support/index.js', // Support file location
  },
  video: false,
});
