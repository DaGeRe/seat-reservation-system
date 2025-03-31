describe('', ()=> {
    

    const buildingId = 6; // Hauptstelle Dresden, Bautzner Straße ab
    const floorId = 5; // 1. Obergeschoss - Hauptstelle Dresden, Bautzner Straße ab
    const roomRemark = 'testraum';
    const newRoomRemark = roomRemark + 2;
    const deskRemark = 'testdesk1';
    const newDeskRemark = 'test_remark_desk' + 2;
    const imgSrc = '/Assets/Hauptstelle Dresden,  Bautzner Str.19ab/1. Obergeschoss.png';
    it('Change room properties', ()=>{
        cy.login().then(()=>{
            cy.rmAllRooms(buildingId, floorId, roomRemark, imgSrc).then(()=>{
                cy.rmAllRooms(buildingId, floorId, newRoomRemark, imgSrc).then(()=>{
                    cy.addRoom(buildingId, floorId, roomRemark, imgSrc).then(()=>{
                        cy.addDesk(buildingId, floorId, roomRemark, imgSrc, deskRemark).then(()=>{
                            cy.visit('/admin').then(()=>{
                                cy.get('button#roomManagement').click().then(()=>{
                                    cy.get('button#editRoom').click().then(()=>{
                                        cy.setFloor(buildingId, floorId, imgSrc).then(()=>{
                                            cy.get(`button#icon_button_${roomRemark}`).click().then(()=>{ 
                                                cy.get('h2').contains(roomRemark).then(()=>{
                                                    Cypress.Promise.all([
                                                        cy.setStr('roomDefinition_setType', 'Normal'),
                                                        cy.setStr('roomDefinition_setStatus', 'enable'),
                                                        cy.setStr('roomDefinition_setRemark', newRoomRemark)
                                                    ]).then(()=>{
                                                        cy.get('button#room_submit_btn').click().then(()=>{
                                                            cy.get('.Toastify__toast').should('be.visible').contains('Room was changed successfully').then(()=>{
                                                                cy.rmRoom(buildingId, floorId, newRoomRemark, imgSrc).then(()=>{
                                                                    cy.wrap('1');
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
                    })
                })
            })
        })
    });
    it('Change desk properties', ()=>{
        cy.login().then(()=>{
            cy.rmAllRooms(buildingId, floorId, roomRemark, imgSrc).then(()=>{
                cy.rmAllRooms(buildingId, floorId, newRoomRemark, imgSrc).then(()=>{
                    cy.addRoom(buildingId, floorId, roomRemark, imgSrc).then(()=>{
                        cy.addDesk(buildingId, floorId, roomRemark, imgSrc, deskRemark).then(()=>{
                            cy.visit('/admin').then(()=>{
                                cy.get('button#roomManagement').click().then(()=>{
                                    cy.get('button#editWorkstation').click().then(()=>{
                                        cy.setFloor(buildingId, floorId, imgSrc).then(()=>{
                                            cy.get(`button#icon_button_${roomRemark}`).click().then(()=>{ 
                                                cy.get('div#textfield_desk_in_room').click().then(()=>{
                                                    cy.get('div').contains(`${deskRemark}`).click().then(()=>{
                                                        Cypress.Promise.all([
                                                            cy.setStr('workstationDefinition_setEquipment', 'with equipment'),
                                                            cy.setStr('workStationDefinition_setRemark', newDeskRemark)
                                                        ]).then(()=>{
                                                            cy.get('button#workstation_submit_btn').click().then(()=>{
                                                                cy.get('.Toastify__toast').should('be.visible').contains('Desk updated successfully').then(()=>{
                                                                    cy.rmDesk(buildingId, floorId, roomRemark, imgSrc, newDeskRemark).then(()=>{
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
                    })
                })
            })
        })
    
        /*cy.login().then(()=>{
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
                                                    cy.get('.Toastify__toast').should('be.visible').contains('Desk updated successfully').then(()=>{
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
        })*/
    });
});