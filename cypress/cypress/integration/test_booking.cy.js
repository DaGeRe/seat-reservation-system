describe('', ()=> {
    const building='Bautzner Str. 19a/b';
    const floor = 'Ground';
    const roomRemark = 'test_remark_room';
    //const roomRemark = 'Raum 027';
    const deskRemark = 'test_remark_desk';
    beforeEach(() => {
        cy.login().then(()=>{
        cy.visit('/floor').then(()=> {
            cy.wait(3000).then(()=> {
                //cy.document().its('readyState').should('eq', 'complete').then(()=> {
                //const roomElement = Cypress.$(`svg[data-testid="icon_button_${roomRemark}"]`);
                const roomElement = Cypress.$(`button#icon_button_${roomRemark}`);
                cy.task('log', 'abcde ' + roomElement.length);
                if (0 !== roomElement.length) {
                    cy.task('log', 'lösche ' + roomElement.length);
                    cy.rmRoom(building, floor, roomRemark);
                }
                cy.addRoom(building, floor, roomRemark).then(()=>{
                    return cy.wrap('1');
                });
                
            });
        });
        });
    });
    it('simple booking', () => {
        cy.login().then(()=>{
            cy.visit('/floor').then(()=>{
                cy.wait(1000).then(()=>{
                    cy.get(`button#icon_button_${roomRemark}`).click().then(()=>{
                        cy.screenshot('ll');
                    })
                })            
            })
        });
    });
});