describe('Test the booking utility', () => {
    /*function deleteRoomByRoomRemark(building, floor, remark) {
        cy.login();
        cy.visit('/admin');
        cy.url().should('include', '/admin');
        cy.get('button.edit-rooms-button').should('exist').click();
        cy.get('div.workstation-button-wrapper').should('be.visible');
        cy.get('button.workstation-button').contains(/Delete Room|Zimmer Entfernen/).should('exist').click();
        cy.get('div.image-container').should('exist');

        // Select building.
        cy.get('div[id="select-building"]').should('be.visible').click();
        cy.get(`li[data-value="${building}"]`).should(('be.visible')).click();
        // Select floor.
        cy.get('div[id="select-floor"]').should('be.visible').click();
        cy.get(`li[data-value="${floor}"]`).should(('be.visible')).click();
        // Find button with testid and click to delete.
        cy.get(`svg[data-testid="icon_button_${remark}"`).should('exist').click();//.click({ multiple: true, force: true });
    }
    function deleteRoomByRoomRemark_ff(building, floor, remark) {
        deleteRoomByRoomRemark(building, floor, remark);
        // Confirm fast forward deleting.
        cy.get('button[id="delete_ff_btn_yes"]').should('exist').click();
        // We shall be back at the admin page.
        cy.url().should('include', '/admin');
    }
    function create_room(building, floor, remark) {
        cy.login();
        cy.visit('/admin');
        cy.url().should('include', '/admin');
        cy.get('button.edit-rooms-button').should('exist').click();
        cy.get('div.workstation-button-wrapper').should('be.visible');
        cy.get('button.workstation-button').contains(/Add Room|Zimmer Hinzufügen/).should('exist').click();
        cy.get('div.image-container').should('exist');
        
        cy.get('svg[style*="color: green"]').should('not.exist');
        cy.get('div.image-container').should('exist').click();
        cy.get('svg[style*="color: green"]').should('exist');
        
        // Select building.
        cy.get('div[id="select-building"]').should('exist').click();
        cy.get(`li[data-value="${building}"]`).should(('be.visible')).click();
        // Select floor.
        cy.get('div[id="select-floor"]').should('be.visible').click();
        cy.get(`li[data-value="${floor}"]`).should(('be.visible')).click();
        // Select type
        cy.get('div[data-testid="select_type"').should('exist').click();
        cy.get('li[data-value="Normal"]').should('exist').click();
        // Select status
        cy.get('div[data-testid="select_status"').should('exist').click();
        cy.get('li[data-value="enable"]').should('exist').click();
        // Write remark
        cy.get('input[id="textfield_remark"]').should('exist').type(remark);
        // Submit
        cy.get('button[id="room_submit_btn"]').should('exist').click();
        
        cy.url().should('include', '/admin');
    }
    function createDeskByRoomRemark(building, floor, roomRemark, deskRemark) {
        cy.login();
        cy.visit('/admin');
        cy.get('button.edit-rooms-button').should('exist').click();
        cy.get('button[id="workstation_button_add_workstation"').should('exist').click();
        // Select building.
        cy.get('div[id="select-building"]').should('exist').click();
        cy.get(`li[data-value="${building}"]`).should(('be.visible')).click();
        // Select floor.
        cy.get('div[id="select-floor"]').should('be.visible').click();
        cy.get(`li[data-value="${floor}"]`).should(('be.visible')).click();
        // Find button with testid and click to add room.
        cy.get(`svg[data-testid="icon_button_${roomRemark}"`).should('exist').click();//.click({ multiple: true, force: true });
        // Set equipment.
        cy.get('div[id="select_equipment"').should('exist').click();
        cy.get('li[data-value="with equipment"]').should('exist').click();
        // Write remark
        cy.get('input[id="textfield_desk_remark"]').should('exist').type(deskRemark);
        // Submit
        cy.get('button[id="desk_submit_btn"]').should('exist').click();

        cy.url().should('include', '/admin');
    }

    function deleteDeskByDeskRemark(building, floor, roomRemark, deskRemark) {
        cy.login();
        cy.visit('/admin');
        cy.get('button.edit-rooms-button').should('exist').click();
        cy.get('button[id="workstation_button_delete_workstation"').should('exist').click();
        
        // Select building.
        cy.get('div[id="select-building"]').should('exist').click();
        cy.get(`li[data-value="${building}"]`).should(('be.visible')).click();
        // Select floor.
        cy.get('div[id="select-floor"]').should('be.visible').click();
        cy.get(`li[data-value="${floor}"]`).should(('be.visible')).click();
        // Find button with testid and click.
        cy.get(`svg[data-testid="icon_button_${roomRemark}"`).should('exist').click();//.click({ multiple: true, force: true });
        // Click the selection field to choose the desk
        cy.get('.textfield_desk_in_room').should('exist').click();
        // Find the entry we like to delete. 
        cy.get('div').contains(`${deskRemark}`).should('exist').click();
        // Delete
        cy.get('button[id="delete_workstation_button"').should('exist').click();
    }

    function deleteDeskByDeskRemark_ff(building, floor, roomRemark, deskRemark) {
        deleteDeskByDeskRemark(building, floor, roomRemark, deskRemark);
        // Confirm fast forward deleting.
        cy.get('button[id="delete_ff_btn_yes"]').should('exist').click();
        // We shall be back at the admin page.
        cy.url().should('include', '/admin');
    }

    function createBooking(building, floor, roomRemark, deskRemark) {
        cy.login();
        cy.visit('/floor');
        cy.url().should('include', '/floor');

        // Found the desired room
        cy.get(`svg[data-testid="icon_button_${roomRemark}"`).should('exist').click();
        // Select the desk
        cy.get('.desk-description.clicked').should('not.exist');
        cy.get('.desk-description').contains(deskRemark).should('exist').click();
        cy.get('.desk-description.clicked').should('exist');
        // Select time range.
        cy.get('div.rbc-time-content').should('exist');
        cy.get('div.rbc-events-container').should('have.value', '');
        // 7-11 AM.
        cy.selectTimeRange(3, 10);
        // The selected time event is present as an event.
        cy.get('div.rbc-events-container').should('not.be.empty', '');
        // Confirm booking #1
        cy.get('.submit-btn').should('exist').click()
    }*/

    it('test basic room, workstation adding/deleting processs process', ()=> {
        const building='Bautzner Str. 19a/b';
        const floor = 'Ground';
        const roomRemark = 'test_remark_room';
        const deskRemark = 'test_remark_desk';
        cy.create_room(building, floor, roomRemark);
        cy.createDeskByRoomRemark(building, floor, roomRemark, deskRemark);
        cy.deleteDeskByDeskRemark(building, floor, roomRemark, deskRemark);
        cy.deleteRoomByRoomRemark(building, floor, roomRemark, deskRemark);
    });

    it('test basic room, workstation and booking adding/deleting processs process', ()=> {
        const building='Bautzner Str. 19a/b';
        const floor = 'Ground';
        const roomRemark = 'test_remark_room';
        const deskRemark = 'test_remark_desk';
        cy.create_room(building, floor, roomRemark);
        cy.createDeskByRoomRemark(building, floor, roomRemark, deskRemark);
        cy.createBooking(building, floor, roomRemark, deskRemark);
        cy.deleteDeskByDeskRemark_ff(building, floor, roomRemark, deskRemark);
        cy.deleteRoomByRoomRemark(building, floor, roomRemark, deskRemark);
    });
  });