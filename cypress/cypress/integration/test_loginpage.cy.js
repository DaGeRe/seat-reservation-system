  // wget -d --no-check-certificate --post-data='{"email":"test@mail.com","password":"test"}' --header='Content-Type:application/json' https://backend:8080/users/login 
  
  // wget -d --no-check-certificate --post-data='{"email":"test@mail.com","password":"test"}' --header='Content-Type:application/json' https://jus-srv-test30.justiz.sachsen.de:8082/users/login

  describe('Test the login page', () => {
    it('test error message if no email is provided', () => {
      cy.visit('/');

      cy.get('[data-testid="loginErrorMsg"]').should('not.exist');
      cy.get('[data-testid="password"]').should('exist').type('test');
      cy.get('[data-testid="loginBtn"]').click();
      cy.get('[data-testid="loginErrorMsg"]').should('exist');
    });

    it('test error message if wrong email is provided', () => {
      cy.visit('/');

      cy.get('[data-testid="loginErrorMsg"]').should('not.exist');
      cy.get('[data-testid="email"]').should('exist').type('test');
      cy.get('[data-testid="password"]').should('exist').type('test');
      cy.get('[data-testid="loginBtn"]').click();
      cy.get('[data-testid="loginErrorMsg"]').should('exist');
    });

    it('test error if no password is provided', () => {
      cy.visit('/');

      cy.get('[data-testid="loginErrorMsg"]').should('not.exist');
      cy.get('[data-testid="email"]').should('exist').type('test');
      cy.get('[data-testid="loginBtn"]').click();
      cy.get('[data-testid="loginErrorMsg"]').should('exist');
    });

    it('test error if wrong password is provided', () => {
      cy.visit('/');

      cy.get('[data-testid="loginErrorMsg"]').should('not.exist');
      cy.get('[data-testid="email"]').should('exist').type('test');
      cy.get('[data-testid="password"]').should('exist').type('tests');
      cy.get('[data-testid="loginBtn"]').click();
      cy.get('[data-testid="loginErrorMsg"]').should('exist');
    });

    it('test login process', () => {
      cy.visit('/');
      
      cy.get('[data-testid="email"]').should('exist').type('test@mail.com');
      cy.get('[data-testid="password"]').should('exist').type('test');
      cy.get('[data-testid="loginBtn"]').click();
      
      cy.login();

      // After an successful login we have to be on the next page.
      cy.url().should('include', '/home');
      // After an successful login calendar events are loaded.
      cy.get('.rbc-row-segment').should('exist');
    });
  });