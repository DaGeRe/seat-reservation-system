describe('', ()=> {
    const building='Bautzner Str. 19a/b';
    const floor = 'Ground';
    const roomRemark = 'test_remark_room';
    const deskRemark = 'test_remark_desk';
    beforeEach(cy.buildUp.bind(null, building, floor, roomRemark, deskRemark));
    afterEach(cy.tearDown.bind(null, building, floor, roomRemark));
    it('simple booking', () => {
        const start_timeslot = 3;
        const end_timeslot = 10; 
        cy.login().then(()=>{
        cy.addBooking(building, floor, roomRemark, deskRemark, start_timeslot, end_timeslot, true).then(()=>{
            cy.countBookings(roomRemark).should('equal', 1);
        });
        })
    });
    it('two simple bookings', () => {
        cy.login().then(()=>{
        cy.addBooking(building, floor, roomRemark, deskRemark, 3, 10, true).then(()=>{
            cy.addBooking(building, floor, roomRemark, deskRemark, 12, 15, true).then(()=>{
                cy.countBookings(roomRemark).should('equal', 2);
            });
        });
        })
    });
    it('try to make two bookings, but they are overlapping', ()=> {
        cy.login().then(()=>{
        cy.addBooking(building, floor, roomRemark, deskRemark, 3, 15, true).then(()=>{
            cy.addBooking(building, floor, roomRemark, deskRemark, 14, 22).then(()=>{
                cy.countBookings(roomRemark).should('equal', 1);
            });
        });
        })
    });
});