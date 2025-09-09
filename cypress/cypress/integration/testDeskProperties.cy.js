describe('Test desk properties ', ()=> {

    const buildingId = 6; // Hauptstelle Dresden, Bautzner Straße ab
    const floorId = 5; // 1. Obergeschoss - Hauptstelle Dresden, Bautzner Straße ab
    const roomRemark = 'testraum';
    const newRoomRemark = roomRemark + 2;
    const deskRemark = 'testdesk1';
    const newDeskRemark = 'test_remark_desk' + 2;
    const imgSrc = '/Assets/Hauptstelle Dresden,  Bautzner Str.19ab/1. Obergeschoss.png';
    
    // it('Change roomType', ()=>{
    //     cy.login().then(()=>{
    //         cy.rmAllRooms(buildingId, floorId, roomRemark, imgSrc).then(()=>{
    //             cy.addRoom(buildingId, floorId, roomRemark, imgSrc).then(()=>{
    //                 cy.visit('/admin').then(()=>{
    //                     cy.get('button#roomManagement').click().then(()=>{
    //                         cy.get('button#editRoom').click().then(()=>{
    //                             cy.setFloor(buildingId, floorId, imgSrc).then(()=>{
    //                                 cy.get(`button#icon_button_${roomRemark}`).click().then(()=>{ 
    //                                     cy.get('h2').contains(roomRemark).then(()=>{
    //                                         cy.screenshot('a');
    //                                     })
    //                                 })
    //                             })
    //                         })
    //                     })
    //                 })
    //             })
    //         })
    //     })
    // });
    
    // it('Change room properties', ()=>{
    //     cy.login(Cypress.env('TEST_ADMIN_MAIL'), Cypress.env('TEST_ADMIN_PW')).then(()=>{
    //         cy.rmAllRooms(buildingId, floorId, roomRemark, imgSrc).then(()=>{
    //             cy.rmAllRooms(buildingId, floorId, newRoomRemark, imgSrc).then(()=>{
    //                 cy.addRoom(buildingId, floorId, roomRemark, imgSrc).then(()=>{
    //                     cy.addDesk(buildingId, floorId, roomRemark, imgSrc, deskRemark).then(()=>{
    //                         cy.visit('/admin').then(()=>{
    //                             cy.get('button#roomManagement').click().then(()=>{
    //                                 cy.get('button#editRoom').click().then(()=>{
    //                                     cy.setFloor(buildingId, floorId, imgSrc).then(()=>{
    //                                         cy.get(`button#icon_button_${roomRemark}`).click().then(()=>{ 
    //                                             cy.get('h2').contains(roomRemark).then(()=>{
    //                                                 Cypress.Promise.all([
    //                                                     cy.setStr('roomDefinition_setType', 'Normal'),
    //                                                     cy.setStr('roomDefinition_setStatus', 'enable'),
    //                                                     cy.setStr('roomDefinition_setRemark', newRoomRemark)
    //                                                 ]).then(()=>{
    //                                                     cy.get('button#modal_submit').click().then(()=>{
    //                                                         cy.get('.Toastify__toast').should('be.visible').contains('Room was changed successfully').then(()=>{
    //                                                             cy.rmRoom(buildingId, floorId, newRoomRemark, imgSrc).then(()=>{
    //                                                                 cy.wrap('1');
    //                                                             })
    //                                                         })
    //                                                     })
    //                                                 })
    //                                             })
    //                                         })
    //                                     })
    //                                 })
    //                             })
    //                         })
    //                     })
    //                 })
    //             })
    //         })
    //     })
    // });
    it('Create desk and change properties', ()=>{
        cy.login()
        .rmAllRooms(buildingId, floorId, roomRemark, imgSrc)
        .rmAllRooms(buildingId, floorId, newRoomRemark, imgSrc)
        .addRoom(buildingId, floorId, roomRemark, imgSrc)
        .addDesk(buildingId, floorId, roomRemark, imgSrc, deskRemark)
        .visit('/admin')
        .get('button#roomManagement').click()
        .get('button#editWorkstation').click()
        .setFloor(buildingId, floorId, imgSrc)
        .get(`button#icon_button_${roomRemark}`).click() 
        .get('div#textfield_desk_in_room').click()
        .get('div').contains(`${deskRemark}`).click().then(()=>{
            Cypress.Promise.all([
                cy.setStr('workstationDefinition_setEquipment', 'with equipment'),
                cy.setStr('workStationDefinition_setRemark', newDeskRemark)
            ]).then(()=>{
                cy.get('button#modal_submit').click()
                .get('.Toastify__toast').should('be.visible').contains('Desk updated successfully')
                .rmDesk(buildingId, floorId, roomRemark, imgSrc, newDeskRemark).then(()=>{
                    return cy.wrap('1');
                });
            })
        })
    })

    it('test if normal user cannot access admin page', ()=>{
        cy.login(Cypress.env('TEST_USER_MAIL'), Cypress.env('TEST_USER_PW'))
        .visit('admin')
        .get('h1').contains('Error')
        .get('p').contains('You have no sufficient rights to see this page!')
        .get('button#generic_back_button').click()
        .url().should('include', '/home');
    });
});