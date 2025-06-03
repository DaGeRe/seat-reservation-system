describe('', ()=> {   
    const buildingId = 6; // Hauptstelle Dresden, Bautzner Straße ab
    const floorId = 5; // 1. Obergeschoss - Hauptstelle Dresden, Bautzner Straße ab
    const roomRemark = 'testraum';
    const deskRemark1 = 'testdesk1';
    const imgSrc = '/Assets/Hauptstelle Dresden,  Bautzner Str.19ab/1. Obergeschoss.png';
    it('simple booking as admin', ()=>{
        const start_timeslot = 3;
        const end_timeslot = 10; 
        cy.login(Cypress.env('TEST_ADMIN_MAIL'), Cypress.env('TEST_ADMIN_PW')).then(()=>{
            cy.rmAllRooms(buildingId, floorId, roomRemark, imgSrc).then(()=>{
                cy.addRoom(buildingId, floorId, roomRemark, imgSrc).then(()=>{
                    cy.addDesk(buildingId, floorId, roomRemark, imgSrc, deskRemark1).then(()=>{
                        cy.addBooking(buildingId, floorId, roomRemark, imgSrc, deskRemark1, start_timeslot, end_timeslot).then(()=>{
                            cy.countBookings(roomRemark).should('equal', 1);
                        })
                    });
                })
            })
        });
    });

    it('simple booking as user', ()=>{
        const start_timeslot = 3;
        const end_timeslot = 10; 
        cy.login(Cypress.env('TEST_ADMIN_MAIL'), Cypress.env('TEST_ADMIN_PW')).then(()=>{
            cy.rmAllRooms(buildingId, floorId, roomRemark, imgSrc).then(()=>{
                cy.addRoom(buildingId, floorId, roomRemark, imgSrc).then(()=>{
                    cy.addDesk(buildingId, floorId, roomRemark, imgSrc, deskRemark1).then(()=>{
                        cy.login(Cypress.env('TEST_USER_MAIL'), Cypress.env('TEST_USER_PW')).then(()=>{
                            cy.addBooking(buildingId, floorId, roomRemark, imgSrc, deskRemark1, start_timeslot, end_timeslot).then(()=>{
                                cy.login(Cypress.env('TEST_ADMIN_MAIL'), Cypress.env('TEST_ADMIN_PW')).then(()=>{
                                    cy.countBookings(roomRemark).should('equal', 1);
                                })
                            })
                        })
                    });
                })
            })
        });
    });

    it('two bookings', ()=>{
        const start_timeslot1 = 3;
        const end_timeslot1 = 10; 
        const start_timeslot2 = 12;
        const end_timeslot2 = 16; 
        
        cy.login(Cypress.env('TEST_ADMIN_MAIL'), Cypress.env('TEST_ADMIN_PW')).then(()=>{
            cy.rmAllRooms(buildingId, floorId, roomRemark, imgSrc).then(()=>{
                cy.addRoom(buildingId, floorId, roomRemark, imgSrc).then(()=>{
                    cy.addDesk(buildingId, floorId, roomRemark, imgSrc, deskRemark1).then(()=>{
                        cy.logout().then(()=>{
                            cy.login(Cypress.env('TEST_USER_MAIL'), Cypress.env('TEST_USER_PW')).then(()=>{
                                cy.addBooking(buildingId, floorId, roomRemark, imgSrc, deskRemark1, start_timeslot1, end_timeslot1).then(()=>{
                                    cy.addBooking(buildingId, floorId, roomRemark, imgSrc, deskRemark1, start_timeslot2, end_timeslot2).then(()=>{
                                        cy.login(Cypress.env('TEST_ADMIN_MAIL'), Cypress.env('TEST_ADMIN_PW')).then(()=>{
                                            cy.countBookings(roomRemark).should('equal', 2);
                                        })
                                    })
                                })
                            })
                        })
                    });
                })
            })
        });
    });

    it('two bookings but overlapping', ()=>{
        const start_timeslot1 = 3;
        const end_timeslot1 = 10; 
        const start_timeslot2 = 8;
        const end_timeslot2 = 16; 
        
        cy.login(Cypress.env('TEST_ADMIN_MAIL'), Cypress.env('TEST_ADMIN_PW')).then(()=>{
            cy.rmAllRooms(buildingId, floorId, roomRemark, imgSrc).then(()=>{
                cy.addRoom(buildingId, floorId, roomRemark, imgSrc).then(()=>{
                    cy.addDesk(buildingId, floorId, roomRemark, imgSrc, deskRemark1).then(()=>{
                        cy.login(Cypress.env('TEST_USER_MAIL'), Cypress.env('TEST_USER_PW')).then(()=>{
                            cy.addBooking(buildingId, floorId, roomRemark, imgSrc, deskRemark1, start_timeslot1, end_timeslot1).then(()=>{
                                cy.visit('/floor').then(()=>{
                                    cy.setFloor(buildingId, floorId, imgSrc).then(()=>{
                                        cy.get(`button#icon_button_${roomRemark}`).click().then(()=>{
                                            cy.get('p').contains(`${deskRemark1}`).click({ force: true }).then(()=>{
                                                cy.selectTimeRange(start_timeslot2, end_timeslot2).then(()=>{
                                                    cy.get('.Toastify__toast').should('be.visible').contains('This slot overlaps with another booking for this desk').then(()=>{
                                                        return cy.wrap('1');
                                                    })    
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        });
    });
});