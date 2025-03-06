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
        const should = 62;
        cy.login().then(()=>{
            cy.visit('/createseries').then(()=>{
                cy.get('#root', { timeout: 10000 }).should('exist').then(()=>{
                    cy.get('div#dates_label').should('exist').then(()=> {//cy.get('h1').should('exist').then(()=> {
                        Cypress.Promise.all([
                            cy.setStr('startDate', startdate),
                            cy.setStr('endDate', enddate),
                        ]).then(()=>{
                            cy.get('div#dates_label').find('span').should('have.length', should).then(()=>{
                                cy.get(`tr[id*="${deskRemark}"`).find('button').click().then(()=>{
                                        cy.countBookings(roomRemark).should('equal', 62);
                                })
                            })
                        })
                    })
                })
            })
        });
    });


    it('simple weekly series creation for wednesday', ()=>{
        const should = 9;
        //const dates = ['2025-01-01', '2025-01-08', '2025-01-15', '2025-01-22', '2025-01-29', '2025-02-05', '2025-02-12', '2025-02-19', '2025-02-26'];
        cy.login().then(()=>{
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
                                    cy.get(`tr[id*="${deskRemark}"`).find('button').click().then(()=>{
                                        cy.countBookings(roomRemark).then((cnt)=>{
                                            cy.wrap(cnt).should('equal', should);
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
    it('simple monthly series creation for friday', ()=>{
        const should = 3;
        /*const dates = [
            '2025-01-03',
            '2025-01-31',
            '2025-02-28',
        ];*/
        cy.login().then(()=>{
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
                                    cy.get(`tr[id*="${deskRemark}"`).find('button').click().then(()=>{
                                        cy.countBookings(roomRemark).then((cnt)=>{
                                            cy.wrap(cnt).should('equal', should);
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
});