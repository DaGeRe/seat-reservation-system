  // wget -d --no-check-certificate --post-data='{"email":"test@mail.com","password":"test"}' --header='Content-Type:application/json' https://backend:8080/users/login 
  
  // wget -d --no-check-certificate --post-data='{"email":"test@mail.com","password":"test"}' --header='Content-Type:application/json' https://jus-srv-test30.justiz.sachsen.de:8082/users/login
  process.env.NO_PROXY = 'backend,localhost,127.0.0.1';

  /*
  function login_2() {
    cy.visit('/');
    // Intercept the login process after the button press.
    cy.intercept('POST', '/users/login').as('loginRequest'); 
    cy.wait('@loginRequest').then((interception) => {
      const response = interception.response;
      expect(response === null).to.equal(false);
      const statusCode = response.statusCode;
      expect(statusCode).to.equal(200);
      const body = response.body;
      const accessToken = response.body.accessToken;
      expect(accessToken === null).to.equal(false);

      cy.get('[data-testid="loginErrorMsg"]').should('not.exist');
      // Token im lokalen Speicher speichern
      cy.window().then((window) => {
        //window.localStorage.setItem('authToken', accessToken);
        //cy.task('log', `localStorage.getItem : ${window.localStorage.getItem('headers')}`);
        window.localStorage.setItem('headers', JSON.stringify({
        'Authorization': 'Bearer ' +  String(accessToken),
        'Content-Type': 'application/json',
      }));
      });
    });
  };
  */
  function login() {
    cy.visit('/');
    cy.intercept('POST', '/users/login').as('loginRequest'); 
    cy.get('[data-testid="email"]').should('exist').type('test@mail.com');
    cy.get('[data-testid="password"]').should('exist').type('test');
    cy.get('[data-testid="loginBtn"]').click();
    cy.wait('@loginRequest').then((interception) => {
      const response = interception.response;
      expect(response === null).to.equal(false);
      const statusCode = response.statusCode;
      expect(statusCode).to.equal(200);
      const body = response.body;
      const accessToken = response.body.accessToken;
      expect(accessToken === null).to.equal(false);

      cy.get('[data-testid="loginErrorMsg"]').should('not.exist');
      // Token im lokalen Speicher speichern
      cy.window().then((window) => {
        //window.localStorage.setItem('authToken', accessToken);
        //cy.task('log', `localStorage.getItem : ${window.localStorage.getItem('headers')}`);
        window.localStorage.setItem('headers', JSON.stringify({
        'Authorization': 'Bearer ' +  String(accessToken),
        'Content-Type': 'application/json',
      }));
      });
    });
  };

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

      // Intercept the login process after the button press.
      //cy.intercept('POST', '/users/login').as('loginRequest'); 
      
      cy.get('[data-testid="email"]').should('exist').type('test@mail.com');
      cy.get('[data-testid="password"]').should('exist').type('test');
      cy.get('[data-testid="loginBtn"]').click();
      
      login();

      // After an successful login we have to be on the next page.
      cy.url().should('include', '/home');
      // After an successful login calendar events are loaded.
      cy.get('.rbc-row-segment').should('exist');
    });
  });

  describe('Test the /home page', () => {
    it('checks all of the gui elements in SidebarComponent', ()=> {
      cy.visit('/home');

      cy.get('[data-testid="SidebarComponent"]').should('exist');
      cy.get('[data-testid="SidebarComponent_Collapse"]').should('exist');
      cy.get('[data-testid="SidebarComponent_Collapse"]').should('exist');
      //tbc
    });

    it('check if calendar events are loaded', ()=> {
      login()
      cy.visit('/home');
      cy.url().should('include', '/home');
      cy.get('[data-testid="Home_Calendar"]').should('exist');
      // The calendar itself cant be found with data-testid 
      cy.get('.rbc-month-view').should('exist');
      // This elment only exists if a data is pulled from the backend.
      cy.get('.rbc-row-segment').should('exist');
      cy.screenshot('check_if_calendar_events_are_loaded.png');
    });
  });

  describe('Test the /home page', () => {
    it('checks all of the gui elements in SidebarComponent', ()=> {
      cy.visit('/home');

      cy.get('[data-testid="SidebarComponent"]').should('exist');
      cy.get('[data-testid="SidebarComponent_Collapse"]').should('exist');
      cy.get('[data-testid="SidebarComponent_Collapse"]').should('exist');
      //tbc
    });

    it('check if calendar events are loaded', ()=> {
      login()
      cy.visit('/home');
      cy.url().should('include', '/home');
      
      cy.get('.rbc-day-bg').should('exist');
    });

    it('create a booking', ()=> {
      login()
      cy.visit('/home');
      cy.url().should('include', '/home');
      
      cy.get('rbc-day-bg rbc-today').should('exist');
    });
  });

  