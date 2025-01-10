describe('React App', () => {
    it('Should load the homepage', () => {
      cy.visit('/');
      cy.contains('Welcome to React'); // Replace with an actual text from your app
    });
  });