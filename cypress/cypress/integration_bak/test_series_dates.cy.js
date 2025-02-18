describe('Test series dates', () => {
    
    beforeEach(() => {
        Cypress.on('fail', (err, runnable) => {
            cy.screenshot('failure-fullpage', { capture: 'fullPage' });
            throw err;
        });

        cy.login();
        cy.visit('/createseries');
        cy.url().should('include', '/createseries');
    });

    /*it('test default dates', ()=>{
        cy.setStr('startDate', '01.01.2025');
        cy.setStr('endDate', '01.01.2025');
        cy.get('div#dates_labels', { timeout: 10000 }).find('span').should('have.length', 1);
        cy.get('div#dates_labels', { timeout: 10000 }).find('span').first().contains('01.01.2025');
        cy.wait(1000);
    });*/

    it('test daily dates', ()=>{
        cy.setStr('startDate', '01.01.2025');
        cy.setStr('endDate', '03.03.2025');
        cy.wait(10000);
        cy.viewport(1920, 1180);
        cy.screenshot('l', { capture: 'fullPage' });
        cy.get('div#dates_labels', { timeout: 20000 }).find('span').should('have.length', 62);
        cy.get('div#dates_labels',{ timeout: 10000 }).find('span').first().contains('01.01.2025');
        cy.get('div#dates_labels',{ timeout: 10000 }).find('span').last().contains('03.03.2025');
    });

    /*it('test weekly monday dates', ()=>{
        cy.setStr('startDate', '01.01.2025');
        cy.setStr('endDate', '03.03.2025');
        cy.setStr('frequence_select', 'weekly');

        cy.get('div#dates_labels', { timeout: 10000 }).find('span').should('have.length', 9);
        cy.get('div#dates_labels', { timeout: 10000 }).find('span').first().contains('06.01.2025');
        cy.get('div#dates_labels', { timeout: 10000 }).find('span').last().contains('03.03.2025');
    });*/

    /*it('test monthly friday dates', ()=>{
        cy.setStr('startDate', '01.01.2025');
        cy.setStr('endDate', '03.03.2025');
        cy.setStr('frequence_select', 'monthly');
        cy.setStr('dayOfTheWeek_select', '4');

        cy.get('div#dates_labels', { timeout: 10000 }).find('span').should('have.length', 3);
        cy.get('div#dates_labels', { timeout: 10000 }).find('span').first().contains('03.01.2025');
        cy.get('div#dates_labels', { timeout: 10000 }).find('span').eq(1).contains('31.01.2025');
        cy.get('div#dates_labels', { timeout: 10000 }).find('span').last().contains('28.02.2025');
    });

    it('test every two/three weeks friday dates', ()=>{
        cy.setStr('startDate', '01.01.2025');
        cy.setStr('endDate', '03.03.2025');
        cy.setStr('frequence_select', 'twoweeks');
        cy.setStr('dayOfTheWeek_select', '4');

        cy.get('div#dates_labels', { timeout: 10000 }).find('span').should('have.length', 5);
        cy.get('div#dates_labels', { timeout: 10000 }).find('span').first().contains('03.01.2025');
        cy.get('div#dates_labels', { timeout: 10000 }).find('span').eq(1).contains('17.01.2025');
        cy.get('div#dates_labels', { timeout: 10000 }).find('span').eq(2).contains('31.01.2025');
        cy.get('div#dates_labels', { timeout: 10000 }).find('span').eq(3).contains('14.02.2025');
        cy.get('div#dates_labels', { timeout: 10000 }).find('span').last().contains('28.02.2025');

        cy.setStr('frequence_select', 'threeweeks');

        cy.get('div#dates_labels', { timeout: 10000 }).find('span').should('have.length', 3);
        cy.get('div#dates_labels', { timeout: 10000 }).find('span').first().contains('03.01.2025');
        cy.get('div#dates_labels', { timeout: 10000 }).find('span').eq(1).contains('24.01.2025');
        cy.get('div#dates_labels', { timeout: 10000 }).find('span').last().contains('14.02.2025');
    });*/
});