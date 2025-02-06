describe('Test the /home page', () => {
    it('checks all of the gui elements in SidebarComponent', ()=> {
      cy.visit('/home');

      cy.get('[data-testid="SidebarComponent"]').should('exist');
      cy.get('[data-testid="SidebarComponent_Collapse"]').should('exist');
      cy.get('[data-testid="SidebarComponent_Collapse"]').should('exist');
      //tbc
    });

    it('check if calendar events are loaded', ()=> {
      cy.login();
      cy.visit('/home');
      cy.url().should('include', '/home');
      cy.get('[data-testid="Home_Calendar"]').should('exist');
      // The calendar itself cant be found with data-testid 
      cy.get('.rbc-month-view').should('exist');
      // This elment only exists if a data is pulled from the backend.
      cy.get('.rbc-row-segment').should('exist');
      cy.get('div.rbc-day-bg.rbc-today').should('exist').should('be.visible');
      cy.get('div.rbc-day-bg.rbc-today').dblclick();
      //cy.screenshot('check_if_calendar_events_are_loaded.png');
      cy.url().should('include', '/floor');
      //cy.screenshot('check_if_calendar_events_are_loaded_2.png');
    });
  });