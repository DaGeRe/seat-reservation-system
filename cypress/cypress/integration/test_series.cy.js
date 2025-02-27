describe('', ()=> {
    const building='Bautzner Str. 19a/b';
    const floor = 'Ground';
    const roomRemark = 'test_remark_room';
    const deskRemark = 'test_remark_desk';
    const startdate = '01.01.2025';
    const enddate = '03.03.2025';
    beforeEach(cy.buildUp.bind(null, building, floor, roomRemark, deskRemark));
    afterEach(cy.tearDown.bind(null, building, floor, roomRemark));
    
    it('Simple series creation', ()=>{
        cy.login().then(()=>{
            cy.visit('/createseries').then(()=>{
                cy.get('h1').should('exist').then(()=> {
                    Cypress.Promise.all([
                        cy.setStr('startDate', startdate),
                        cy.setStr('endDate', enddate),
                    ]).then(()=>{
                        cy.get(`tr[id*="${deskRemark}"`).find('button').click().then(()=>{
                            cy.wait(2000).then(()=>{
                                cy.countBookings(roomRemark).should('equal', 62);
                            })
                        })
                    })
                })
            })
        });
    });
    it('simple weekly series creation for wednesday', ()=>{
        const should = 9;
        cy.login().then(()=>{
            cy.visit('/createseries').then(()=>{
                cy.get('h1').should('exist').then(()=> {
                    Cypress.Promise.all([
                        cy.setStr('startDate', startdate),
                        cy.setStr('endDate', enddate),
                        cy.setStr('frequence_select', 'weekly'),
                        cy.setStr('dayOfTheWeek_select', '2') //mi
                    ]).then(()=>{
                        cy.wait(5000).then(()=>{
                            cy.get(`tr[id*="${deskRemark}"`).find('button').click().then(()=>{
                                cy.wait(3000).then(()=>{
                                    cy.screenshot('a');
                                    cy.countBookings(roomRemark).then((cnt)=>{
                                        if (cnt!=should) {
                                            cy.screenshot('fail_series_wednesday_'+cnt);
                                        }
                                        cy.wrap(cnt).should('equal', should);
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
        cy.login().then(()=>{
            cy.visit('/createseries').then(()=>{
                cy.get('h1').should('exist').then(()=> {
                    Cypress.Promise.all([
                        cy.setStr('startDate', startdate),
                        cy.setStr('endDate', enddate),
                        cy.setStr('frequence_select', 'monthly'),
                        cy.setStr('dayOfTheWeek_select', '4') //fr
                    ]).then(()=>{
                        cy.wait(5000).then(()=>{
                            cy.get(`tr[id*="${deskRemark}"`).find('button').click().then(()=>{
                                cy.screenshot('b');
                                cy.wait(3000).then(()=>{
                                    cy.countBookings(roomRemark).then((cnt)=>{
                                        if (cnt!=should) {
                                            cy.screenshot('fail_series_friday_'+cnt);
                                        }
                                        cy.wrap(cnt).should('equal', should);
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