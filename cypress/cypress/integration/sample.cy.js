/*describe('React App', () => {
    it('Should load the homepage', () => {
      console.log('Cypress1');
      cy.visit('/');
      console.log('Cypress2');
      cy.contains('Welcome to React'); // Replace with an actual text from your app
      console.log('Cypress3');
    });
  });*/

/*  const agent = new https.Agent({
    cert: fs.readFileSync('tls/jus-srv-test30.justiz.sachsen.de.crt'),
    key: fs.readFileSync('tls/jus-srv-test30.justiz.sachsen.de.pk.un_encrypted.pem'),
    rejectUnauthorized: false
  });*/

  /*describe('HTTPS Request', () => {
    it('sends a secure request', () => {
      cy.task('log', 'FOOOO');
      //console.log('FOOOOO', response.body); // Hier ist der HTML-Inhalt
      cy.request({
        method: 'GET',
        url: 'https://frontend:3001',
        ssl: { cert: 'tls/jus-srv-test30.justiz.sachsen.de.crt', key: 'tls/jus-srv-test30.justiz.sachsen.de.pk.un_encrypted.pem', rejectUnauthorized: false }
      }).then((response) => {
        
        expect(response.status).to.eq(200);
      });
    });
  });*/

/*describe('Check button text', () => {
    it('should have the correct button text', () => {
      cy.visit('https://localhost:3001');
      cy.get('[data-testid="email"]')
      .should('exist')
      .type('test@mail.com')
      .should('have.value', 'test@mail.com');
      cy.get('[data-testid="password"]')
      .should('exist')
      .type('test')
      .should('have.value', 'test');
      cy.get('h1').should('exist'); // Check that the <h1> element exists

      cy.get('[data-testid="loginBtn"]').should('exist').click();  // Replace with your actual button selector
      

      cy.url().should('include', '/home');
      //cy.get('h1').should('contain.text', 'Anmeldung'); // Check that <h1> contains specific text
    });
  });*/
  describe('Google Search Test', () => {
    it('should load Google', () => {
      cy.visit('/').then((response) => {
        cy.task('log', `HTTP Status: ${response.status}`);
      });
      cy.request('/').then((response) => {
        cy.task('log', `HTTP Status: ${response.status}`); // Gibt den HTTP-Status aus
        cy.task('log', `Response Body: ${response.body}`); // Optional: Antworttext anzeigen
      });
      cy.get('h1').should('exist');
      cy.get('h1').then((h1) => {
        //console.log(`h1 text: ${h1.text()}`);
        let a = `${h1.html()}`;
        cy.task('log', 'h1: ', a);
        cy.log('abcDEF ' + h1.text());
      });
      cy.get('body').should('be.empty');
      cy.get('body').then((body) => {
        //console.log(`h1 text: ${h1.text()}`);
        let a = `${body.html()}`;
        cy.task('log', 'body: ', '|', `${body.text()}`);
      });
    });
  });