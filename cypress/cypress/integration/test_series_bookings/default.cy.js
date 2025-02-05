describe('Test series dates', () => {
    const building='Bautzner Str. 19a/b';
    const floor = 'Ground';
    const roomRemark = 'test_remark_room';
    const deskRemark = 'test_remark_desk';
    before(()=>{
        cy.createRoom(building, floor, roomRemark);
        cy.createDeskByRoomRemark(building, floor, roomRemark, deskRemark);
    });

    after(()=>{
        //cy.deleteDeskByDeskRemark(building, floor, roomRemark, deskRemark);
        cy.deleteRoomByRoomRemark_ff(building, floor, roomRemark);
    });

    beforeEach(() => {
        Cypress.on('fail', (err, runnable) => {
            cy.screenshot('failure-fullpage', { capture: 'fullPage' });
            throw err;
        });

        Cypress.config('defaultCommandTimeout', 10000);

        cy.login();
        cy.visit('/createseries');
        cy.url().should('include', '/createseries');
    });

    it('test bookings for default dates', ()=>{
        cy.setStr('startDate', '01.01.2025', cy.setStr.bind(null, 'endDate', '01.01.2025'));

        cy.get('table#room_table',{ timeout: 10000 }).find('tr').contains('td', deskRemark).should('exist');
        cy.get(`button#sbmt_btn_${deskRemark}`,{ timeout: 10000 }).should('exist').click();
        
        cy.get('div#dates_labels', { timeout: 10000 }).find('span').should('have.length', 62);
        cy.test_booking_on_date('01.01.2025', roomRemark);
    });
});