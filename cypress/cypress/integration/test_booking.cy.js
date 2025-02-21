describe('', ()=> {
    const building='Bautzner Str. 19a/b';
    const floor = 'Ground';
    const roomRemark = 'test_remark_room';
    const deskRemark = 'test_remark_desk';
    beforeEach(cy.buildUp.bind(null, building, floor, roomRemark, deskRemark)/*() => {
        cy.login().then(()=>{
            cy.visit('/floor').then(()=> {
                cy.wait(1000).then(()=> {
                    const roomElement = Cypress.$(`button#icon_button_${roomRemark}`);
                    //cy.task('log', 'abcde ' + roomElement.length);
                    if (0 !== roomElement.length) {
                        cy.rmDesk(building, floor, roomRemark, deskRemark).then(()=>{
                            cy.rmRoom(building, floor, roomRemark);
                        })
                    }
                    cy.addRoom(building, floor, roomRemark).then(()=>{
                        cy.addDesk(building, floor, roomRemark, deskRemark).then(()=>{
                            return cy.wrap('1');
                        })
                    })
                })
            })
        })
    }*/);
    it('simple booking', () => {
        const start_timeslot = 3;
        const end_timeslot = 10; 
        cy.addBooking(building, floor, roomRemark, deskRemark, start_timeslot, end_timeslot).then(()=>{
            cy.countBookings(roomRemark).should('equal', 1);
        });
    });
    it('two simple bookings', () => {
        const start_timeslot = 3;
        const end_timeslot = 10; 
        cy.addBooking(building, floor, roomRemark, deskRemark, 3, 10).then(()=>{
            cy.addBooking(building, floor, roomRemark, deskRemark, 12, 15).then(()=>{
                cy.countBookings(roomRemark).should('equal', 2);
            });
        });
    });
});