describe('', ()=> {   
    const buildingId = 6; // Hauptstelle Dresden, Bautzner Straße ab
    const floorId = 5; // 1. Obergeschoss - Hauptstelle Dresden, Bautzner Straße ab
    const roomRemark = 'testraum';
    const deskRemark1 = 'testdesk1';
    const imgSrc = '/Assets/Hauptstelle Dresden,  Bautzner Str.19ab/1. Obergeschoss.png';
    it('simple booking', ()=>{
        const start_timeslot = 3;
        const end_timeslot = 10; 
        
        cy.login('test_admin@mail.com', 'test').then(()=>{
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

    it('two bookings', ()=>{
        const start_timeslot1 = 3;
        const end_timeslot1 = 10; 
        const start_timeslot2 = 12;
        const end_timeslot2 = 16; 
        
        cy.login('test_admin@mail.com', 'test').then(()=>{
            cy.rmAllRooms(buildingId, floorId, roomRemark, imgSrc).then(()=>{
                cy.addRoom(buildingId, floorId, roomRemark, imgSrc).then(()=>{
                    cy.addDesk(buildingId, floorId, roomRemark, imgSrc, deskRemark1).then(()=>{
                        cy.logout().then(()=>{
                            cy.login('test_user@mail.com', 'test').then(()=>{
                                cy.addBooking(buildingId, floorId, roomRemark, imgSrc, deskRemark1, start_timeslot1, end_timeslot1).then(()=>{
                                    cy.addBooking(buildingId, floorId, roomRemark, imgSrc, deskRemark1, start_timeslot2, end_timeslot2).then(()=>{
                                        cy.countBookings(roomRemark).should('equal', 2);
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
        
        cy.login('test_admin@mail.com', 'test').then(()=>{
            cy.rmAllRooms(buildingId, floorId, roomRemark, imgSrc).then(()=>{
                cy.addRoom(buildingId, floorId, roomRemark, imgSrc).then(()=>{
                    cy.addDesk(buildingId, floorId, roomRemark, imgSrc, deskRemark1).then(()=>{
                        cy.addBooking(buildingId, floorId, roomRemark, imgSrc, deskRemark1, start_timeslot1, end_timeslot1).then(()=>{
                            cy.visit('/floor').then(()=>{
                                cy.setFloor(buildingId, floorId, imgSrc).then(()=>{
                                    cy.get(`button#icon_button_${roomRemark}`).click().then(()=>{
                                        cy.get('div').contains(`${deskRemark1}`).click().then(()=>{
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
        });
    });

    //beforeEach(cy.buildUp.bind(null, building, floor, roomRemark, deskRemark));
    //afterEach(cy.tearDown.bind(null, building, floor, roomRemark));
    /*!it('simple booking', () => {
        const start_timeslot = 3;
        const end_timeslot = 10; 
        const deskRemark = 'testtisch';
        const roomRemark = 'testraum';
        const buildingId = 6; // Hauptstelle Dresden, Bautzner Straße ab
        const floorId = 5; // 1. Obergeschoss - Hauptstelle Dresden, Bautzner Straße ab
        cy.login('test_user@mail.com', 'test').then(()=>{
            cy.visit('/floor').then(()=>{
                cy.wait(1000).then(()=>{
                    cy.get('div#Floor_FloorImage_floorSelector_setBuilding').click().then(()=>{
                        cy.get(`li#Floor_FloorImage_building_${buildingId}`).click().then(()=>{
                            cy.get('div#Floor_FloorImage_floorSelector_setFloor').click().then(()=>{
                                cy.get(`li#Floor_FloorImage_floor_${floorId}`).click().then(()=>{
                                    cy.get('img').should('exist').should('have.attr', 'src').and('include', '/Assets/Hauptstelle Dresden,  Bautzner Str.19ab/1. Obergeschoss.png').then(()=>{
                                        cy.get(`#icon_button_${roomRemark}`).should('exist').click().then(()=>{
                                            cy.wait(1000).then(()=>{
                                                cy.get('div').contains(`${deskRemark}`).click().then(()=>{
                                                    cy.selectTimeRange(start_timeslot, end_timeslot).then(()=>{
                                                        cy.get('button.submit-btn').click().then(()=>{
                                                            cy.get('.react-confirm-alert').should('be.visible').contains(deskRemark).get('button').contains('Yes').click().then(()=>{
                                                                cy.get('.Toastify__toast').should('be.visible').contains('Booking saved successfully').then(()=>{
                                                                    cy.visit('/mybookings').then(()=>{
                                                                        cy.screenshot('b');
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
                            });
                        });                        
                    });
                });
            });            
        });
    })*/
    /*it('simple booking', () => {
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
    });*/
});