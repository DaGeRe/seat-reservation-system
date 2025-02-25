describe('', ()=> {
    const building='Bautzner Str. 19a/b';
    const floor = 'Ground';
    const roomRemark = 'test_remark_room';
    const newRoomRemark = roomRemark + 2;
    const deskRemark = 'test_remark_desk';
    const newDeskRemark = 'test_remark_desk' + 2;
    beforeEach(cy.buildUp.bind(null, building, floor, roomRemark, deskRemark));
    it('Change room properties', ()=>{
        cy.login().then(()=>{
            cy.visit('/admin').then(()=>{
                cy.url().should('contains', '/admin').then(()=> {
                    cy.get('button#roomManagement').click().then(()=>{
                        cy.get('button#editRoom').click().then(()=>{
                            Cypress.Promise.all([
                                cy.setStr('floorselector_setBuilding', building),
                                cy.setStr('floorselector_setFloor', floor)
                            ]).then(()=>{
                                cy.get(`button#icon_button_${roomRemark}`).click().then(()=>{ 
                                    cy.get('h2').contains(roomRemark).then(()=>{
                                        Cypress.Promise.all([
                                            cy.setStr('roomDefinition_setType', 'Normal'),
                                            cy.setStr('roomDefinition_setStatus', 'enable'),
                                            cy.setStr('roomDefinition_setRemark', newRoomRemark)
                                        ]).then(()=>{
                                            cy.get('button#room_submit_btn').click().then(()=>{
                                                cy.rmRoom(building, floor, newRoomRemark).then(()=>{
                                                    return cy.wrap('1');
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
    it('Change desk properties', ()=>{
        cy.login().then(()=>{
            cy.visit('/admin').then(()=>{
                //cy.wait(1000).then(()=> {
                cy.url().should('contains', '/admin').then(()=> {
                    cy.get('button#roomManagement').click().then(()=>{
                        cy.get('button#editWorkstation').click().then(()=>{
                            Cypress.Promise.all([
                                cy.setStr('floorselector_setBuilding', building),
                                cy.setStr('floorselector_setFloor', floor)
                            ]).then(()=>{
                                cy.get(`button#icon_button_${roomRemark}`).click().then(()=>{ 
                                    cy.get('div#textfield_desk_in_room').click().then(()=>{
                                        cy.get('div').contains(`${deskRemark}`).click().then(()=>{
                                            Cypress.Promise.all([
                                                cy.setStr('workstationDefinition_setEquipment', 'with equipment'),
                                                cy.setStr('workStationDefinition_setRemark', newDeskRemark)
                                            ]).then(()=>{
                                                cy.get('button#workstation_submit_btn').click().then(()=>{
                                                    cy.rmDesk(building, floor, roomRemark, newDeskRemark).then(()=>{
                                                        return cy.wrap('1');
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
        })
    });
});