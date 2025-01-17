const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://jus-srv-test30.justiz.sachsen.de:3001',
    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(message);
          return null; // Return null since tasks need to return something
        },
      });
      on('task', {
        setUserData: (userData) => {
          global.userData = userData;
          return null;
        },
        getUserData: () => {
          return global.userData;
        },
      });
    },
    specPattern: 'cypress/integration/**/*.cy.{js,jsx,ts,tsx}', // New pattern for test files
    supportFile: false,
  },
  video: false,
});
