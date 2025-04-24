describe('', ()=> {
    const startdate = '01.01.2025';
    const enddate = '03.03.2025';

    const buildingId = 6; // Hauptstelle Dresden, Bautzner Straße ab
    const floorId = 5; // 1. Obergeschoss - Hauptstelle Dresden, Bautzner Straße ab
    const roomRemark = 'testraum';
    const deskRemark1 = 'testdesk1';
    const imgSrc = '/Assets/Hauptstelle Dresden,  Bautzner Str.19ab/1. Obergeschoss.png';
    
    it('Simple series creation', ()=>{
        const should = 62;
        cy.login('test_admin@mail.com', Cypress.env('TEST_ADMIN_PW')).then(()=>{
            cy.rmAllRooms(buildingId, floorId, roomRemark, imgSrc).then(()=>{
                cy.addRoom(buildingId, floorId, roomRemark, imgSrc).then(()=>{
                    cy.addDesk(buildingId, floorId, roomRemark, imgSrc, deskRemark1).then(()=>{
                        cy.logout().then(()=>{
                            cy.login('test_user@mail.com', Cypress.env('TEST_USER_PW')).then(()=>{
                                cy.visit('/createseries').then(()=>{
                                    cy.get('#root', { timeout: 10000 }).should('exist').then(()=>{
                                        cy.get('div#dates_label').should('exist').then(()=> {//cy.get('h1').should('exist').then(()=> {
                                            Cypress.Promise.all([
                                                cy.setStr('startDate', startdate),
                                                cy.setStr('endDate', enddate),
                                            ]).then(()=>{
                                                cy.get('div#dates_label').find('span').should('have.length', should).then(()=>{
                                                    cy.get(`tr[id*="${deskRemark1}"`).find('button').click().then(()=>{
                                                        cy.get('.Toastify__toast').should('be.visible').should('include.text', 'Creation of series bookings from').should('include.text', 'was successful.').then(()=>{
                                                            cy.countBookings(roomRemark).should('equal', 62);
                                                        });
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    });
                })
            })
        })
    });

    it('simple weekly series creation for wednesday', ()=>{
        const should = 9;
        cy.login('test_admin@mail.com', Cypress.env('TEST_ADMIN_PW')).then(()=>{
            cy.rmAllRooms(buildingId, floorId, roomRemark, imgSrc).then(()=>{
                cy.addRoom(buildingId, floorId, roomRemark, imgSrc).then(()=>{
                    cy.addDesk(buildingId, floorId, roomRemark, imgSrc, deskRemark1).then(()=>{
                        cy.logout().then(()=>{
                            cy.login('test_user@mail.com', Cypress.env('TEST_USER_PW')).then(()=>{
                                cy.visit('/createseries').then(()=>{
                                    cy.get('#root', { timeout: 10000 }).should('exist').then(()=>{
                                        cy.get('div#dates_label').should('exist').then(()=> {
                                            Cypress.Promise.all([
                                                cy.setStr('startDate', startdate),
                                                cy.setStr('endDate', enddate),
                                                cy.setStr('frequence_select', 'weekly'),
                                                cy.setStr('dayOfTheWeek_select', '2'), //mi
                                                cy.setStr('startTime', '08:00:00'),
                                                cy.setStr('endTime', '11:00:00')
                                            ]).then(()=>{
                                                cy.get('div#dates_label').find('span', { timeout: 20000 })
                                                    .should('have.length.greaterThan', 0)
                                                    .then(() => {
                                                        cy.get('div#dates_label').find('span').should('have.length', should).then(()=>{
                                                        cy.get(`tr[id*="${deskRemark1}"`).find('button').click().then(()=>{
                                                            cy.get('.Toastify__toast').should('be.visible').should('include.text', 'Creation of series bookings from').should('include.text', 'was successful.').then(()=>{
                                                                cy.countBookings(roomRemark).then((cnt)=>{
                                                                    cy.wrap(cnt).should('equal', should);
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
                    })
                })
            })
        })
    });

    it('simple monthly series creation for friday', ()=>{
        const should = 3;
        cy.login('test_admin@mail.com', Cypress.env('TEST_ADMIN_PW')).then(()=>{
            cy.rmAllRooms(buildingId, floorId, roomRemark, imgSrc).then(()=>{
                cy.addRoom(buildingId, floorId, roomRemark, imgSrc).then(()=>{
                    cy.addDesk(buildingId, floorId, roomRemark, imgSrc, deskRemark1).then(()=>{
                        cy.logout().then(()=>{
                            cy.login('test_user@mail.com', Cypress.env('TEST_USER_PW')).then(()=>{
                                cy.visit('/createseries').then(()=>{
                                    cy.get('#root', { timeout: 10000 }).should('exist').then(()=>{
                                        cy.get('div#dates_label').should('exist').then(()=> {
                                            Cypress.Promise.all([
                                                cy.setStr('startDate', startdate),
                                                cy.setStr('endDate', enddate),
                                                cy.setStr('frequence_select', 'monthly'),
                                                cy.setStr('dayOfTheWeek_select', '4'), //fr
                                                cy.setStr('startTime', '15:30:00'),
                                                cy.setStr('endTime', '18:00:00'),
                                            ]).then(()=>{
                                                cy.get('div#dates_label').find('span', { timeout: 20000 }).should('have.length.greaterThan', 0).then(() => {
                                                    cy.get('div#dates_label').find('span').should('have.length', should).then(()=>{
                                                        cy.get(`tr[id*="${deskRemark1}"`).find('button').click().then(()=>{
                                                            cy.get('.Toastify__toast').should('be.visible').should('include.text', 'Creation of series bookings from').should('include.text', 'was successful.').then(()=>{
                                                                cy.countBookings(roomRemark).then((cnt)=>{
                                                                    cy.wrap(cnt).should('equal', should);
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
                        });
                    })
                })
            })
        })
    })
});