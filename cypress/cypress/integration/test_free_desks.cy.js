describe('', ()=> {
    const buildingId = 6; // Hauptstelle Dresden, Bautzner Straße ab
    const floorId = 5; // 1. Obergeschoss - Hauptstelle Dresden, Bautzner Straße ab
    const roomRemark = 'testraum';
    const deskRemark1 = 'testdesk1';
    const imgSrc = '/Assets/Hauptstelle Dresden,  Bautzner Str.19ab/1. Obergeschoss.png';
    
    const day = '01.01.2025';
    const day2 = '02.01.2025';
    const start = '08:30:00';
    const end = '14:15:00';

    it('simple booking on free desks', () => {
        cy.login().then(()=>{
            cy.login(Cypress.env('TEST_ADMIN_MAIL'), Cypress.env('TEST_ADMIN_PW')).then(()=>{
                cy.rmAllRooms(buildingId, floorId, roomRemark, imgSrc).then(()=>{
                    cy.addRoom(buildingId, floorId, roomRemark, imgSrc).then(()=>{
                        cy.addDesk(buildingId, floorId, roomRemark, imgSrc, deskRemark1).then(()=>{
                            cy.visit('freeDesks').then(()=>{
                                Cypress.Promise.all([
                                    cy.setStr('freeDesks_bookingDate', day),
                                    cy.setStr('freeDesks_startTime', start),
                                    cy.setStr('freeDesks_endTime', end)
                                ]).then(()=>{
                                    cy.wait(1000).then(()=>{
                                        cy.get('div#freeDesks_selectBuilding').click().then(()=>{
                                            cy.get(`li#createSeries_building_${buildingId}`).click().then(()=>{
                                                cy.wait(5000).then(()=>{
                                                    cy.get(`tr#freeDesks_${deskRemark1}`).should('exist').find('button').click().then(()=>{
                                                        cy.get('.react-confirm-alert').should('be.visible').contains(deskRemark1).get('button').contains('Yes').click().then(()=>{
                                                            cy.get('.Toastify__toast').should('be.visible').contains('Booking saved successfully').then(()=>{
                                                                cy.countBookings(roomRemark).should('equal', 1).then(()=>{
                                                                    return cy.wrap('1');
                                                                })
                                                            })
                                                        })
                                                    }) 
                                                })
                                            })
                                        })
                                    });
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
            cy.login(Cypress.env('TEST_ADMIN_MAIL'), Cypress.env('TEST_ADMIN_PW')).then(()=>{
                cy.rmAllRooms(buildingId, floorId, roomRemark, imgSrc).then(()=>{
                    cy.addRoom(buildingId, floorId, roomRemark, imgSrc).then(()=>{
                        cy.addDesk(buildingId, floorId, roomRemark, imgSrc, deskRemark1).then(()=>{
                            cy.login(Cypress.env('TEST_USER_MAIL'), Cypress.env('TEST_USER_PW')).then(()=>{
                                cy.visit('freeDesks').then(()=>{
                                    Cypress.Promise.all([
                                        cy.setStr('freeDesks_bookingDate', day),
                                        cy.setStr('freeDesks_startTime', start),
                                        cy.setStr('freeDesks_endTime', end)
                                    ]).then(()=>{
                                        cy.wait(1000).then(()=>{
                                            cy.get('div#freeDesks_selectBuilding').click().then(()=>{
                                                cy.get(`li#createSeries_building_${buildingId}`).click().then(()=>{
                                                    cy.wait(5000).then(()=>{
                                                        cy.get(`tr#freeDesks_${deskRemark1}`).should('exist').find('button').click().then(()=>{
                                                            cy.get('.react-confirm-alert').should('be.visible').contains(deskRemark1).get('button').contains('Yes').click().then(()=>{
                                                                cy.get('.Toastify__toast').should('be.visible').contains('Booking saved successfully').then(()=>{
                                                                    cy.get(`tr#freeDesks_${deskRemark1}`).should('not.exist').then(()=>{
                                                                        cy.setStr('freeDesks_bookingDate', day2).then(()=>{
                                                                            cy.get(`tr#freeDesks_${deskRemark1}`).should('exist').find('button').click().then(()=>{
                                                                                cy.login(Cypress.env('TEST_ADMIN_MAIL'), Cypress.env('TEST_ADMIN_PW')).then(()=>{
                                                                                    cy.countBookings(roomRemark).should('equal', 2).then(()=>{                  
                                                                                        return cy.wrap('1');
                                                                                    })
                                                                                })
                                                                            })
                                                                        })                  
                                                                    });
                                                                })
                                                            })
                                                        }) 
                                                    })
                                                })
                                            })
                                        });
                                    })
                                });
                            })
                        });
                    });
                });
            });
        });
    })
});
        