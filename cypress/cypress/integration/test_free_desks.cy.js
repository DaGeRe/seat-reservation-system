describe('', ()=> {
    /*const building='Bautzner Str. 19a/b';
    const floor = 'Ground';
    const roomRemark = 'test_remark_room';
    const deskRemark = 'test_remark_desk';
    */

    const day = '01.01.2025';
    const day2 = '02.01.2025';
    const start = '08:30:00';
    const end = '14:15:00';
    const building = 'Chemnitz';
    const floor = 'Fourth_Attic';
    const roomRemark = 'test_room_c';
    const deskRemark = 'test_desk_c';

    beforeEach(cy.buildUp.bind(null, building, floor, roomRemark, deskRemark));
    afterEach(cy.tearDown.bind(null, building, floor, roomRemark));

    it('simple booking on free desks', () => {
        cy.login().then(()=>{
            cy.visit('freeDesks').then(()=>{
                cy.url().should('contains', '/freeDesks').then(()=> {
                    Cypress.Promise.all([
                        cy.setStr('freeDesks_bookingDate', day),
                        cy.setStr('freeDesks_startTime', start),
                        cy.setStr('freeDesks_endTime', end),
                        cy.setStr('freeDesks_selectBuilding', building)
                    ]).then(()=>{
                        cy.wait(5000).then(()=>{
                            cy.get(`tr#freeDesks_${deskRemark}`).should('exist').find('button').click().then(()=>{
                                cy.get('.react-confirm-alert').should('be.visible').contains(deskRemark).get('button').contains('Yes').click().then(()=>{
                                    cy.get('.Toastify__toast').should('be.visible').contains('Booking saved successfully').then(()=>{
                                        cy.countBookings(roomRemark).should('equal', 1)
                                    })
                                })
                            });
                        });
                    });
                });
            });
        });
    })
    it('two bookings on free desks', () => {
        cy.login().then(()=>{
            cy.visit('freeDesks').then(()=>{
                cy.url().should('contains', '/freeDesks').then(()=> {
                    Cypress.Promise.all([
                        cy.setStr('freeDesks_bookingDate', day),
                        cy.setStr('freeDesks_startTime', start),
                        cy.setStr('freeDesks_endTime', end),
                        cy.setStr('freeDesks_selectBuilding', building)
                    ]).then(()=>{
                        cy.get(`tr#freeDesks_${deskRemark}`).should('exist').find('button').click().then(()=>{
                            cy.get('.react-confirm-alert').should('be.visible').contains(deskRemark).get('button').contains('Yes').click().then(()=>{
                                cy.get('.Toastify__toast').should('be.visible').contains('Booking saved successfully').then(()=>{
                                    Cypress.Promise.all([
                                        cy.setStr('freeDesks_bookingDate', day),
                                        
                                    ]).then(()=>{
                                        // Be sure that the desk is not there since it is occupied.
                                        cy.get(`tr#freeDesks_${deskRemark}`).should('not.exist').then(()=>{
                                            cy.setStr('freeDesks_bookingDate', day2).then(()=>{
                                                cy.get(`tr#freeDesks_${deskRemark}`).should('exist').find('button').click().then(()=>{
                                                    cy.countBookings(roomRemark).should('equal', 2);
                                                })
                                            })                                            
                                        })
                                    })
                                })
                                //})
                            })
                        });
                        //});
                    });
                });
            });
        });
    })
});
        