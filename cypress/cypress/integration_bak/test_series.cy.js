describe('Test series booking', () => {
    it('', ()=> {
        cy.login();
        cy.visit('/createseries');
        cy.url().should('include', '/createseries');


        //cy.setTime('div#startDate input', '2025-01-01T12:00:00.000Z');
        cy.setDate(
            'div#startDate input', 
            '2025-01-01T12:00:00.000Z', 
            cy.setDate.bind(
                null,
                'div#endDate input', 
                '2025-05-01T12:00:00.000Z',
                () => {
                    cy.screenshot('d');
                }
            )
        );
        


  });
});