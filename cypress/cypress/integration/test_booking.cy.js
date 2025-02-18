describe('', ()=> {
    const building='Bautzner Str. 19a/b';
    const floor = 'Ground';
    //const roomRemark = 'test_remark_room';
    const roomRemark = 'Raum 027';
    const deskRemark = 'test_remark_desk';
    beforeEach(() => {
        cy.login();
        cy.visit('/floor').then(()=> {
            cy.wait(1000).then(()=> {
                //cy.document().its('readyState').should('eq', 'complete').then(()=> {
                    
                
                    const roomElement1 = Cypress.$('svg[data-testid="icon_button_Raum 027"]');
                    const roomElement2 = Cypress.$(`svg`);
                    //cy.task('log', 'abcde ' + roomElement.length + ' ' + `svg[data-testid="icon_button_${roomRemark}"]`);
                    cy.task('log', 'abcde ' + roomElement1.length + " | " + roomElement2.length);
                    cy.screenshot('m');
                
                
                //});
            });
        });
        /**Cypress.$(document).ready(function(){
            const divs = Cypress.$('div');
            cy.task('log', 'efgh');
        });*/

        

        
        

    });
    /*afterEach(()=> {
        cy.deleteDeskByDeskRemark(building, floor, roomRemark, deskRemark);
        cy.deleteRoomByRoomRemark(building, floor, roomRemark, deskRemark);
    });*/
    it('simple booking', () => {
        cy.login();
        cy.visit('/floor');
        //cy.get(`svg[data-testid="icon_button_${roomRemark}"]`).click();
    });
});