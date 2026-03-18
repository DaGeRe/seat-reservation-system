describe('Back button behavior', () => {
    const buildingId = 6; // Hauptstelle Dresden, Bautzner Straße ab
    const floorId = 5; // 1. Obergeschoss - Hauptstelle Dresden, Bautzner Straße ab
    const imgSrc = '/Assets/Hauptstelle Dresden,  Bautzner Str.19ab/1. Obergeschoss.png';
    const roomRemark = `test_back_room_${Date.now()}`;
    const deskRemark = `test_back_desk_${Date.now()}`;

    before(() => {
        cy.login(Cypress.env('TEST_ADMIN_MAIL'), Cypress.env('TEST_ADMIN_PW'))
            .rmAllRooms(buildingId, floorId, roomRemark, imgSrc)
            .addRoom(buildingId, floorId, roomRemark, imgSrc)
            .addDesk(buildingId, floorId, roomRemark, imgSrc, deskRemark)
            .logout();
    });

    after(() => {
        cy.login(Cypress.env('TEST_ADMIN_MAIL'), Cypress.env('TEST_ADMIN_PW'))
            .rmAllRooms(buildingId, floorId, roomRemark, imgSrc);
    });

    it('does not render generic back button on sidebar pages', () => {
        cy.login(Cypress.env('TEST_USER_MAIL'), Cypress.env('TEST_USER_PW'))
            .visit('/favourites')
            .get('button#generic_back_button')
            .should('not.exist');
    });

    it('renders back button on carpark and redirects to home', () => {
        const flowDateIso = new Date().toISOString();

        cy.login(Cypress.env('TEST_USER_MAIL'), Cypress.env('TEST_USER_PW'))
            .url()
            .should('include', '/home')
            .window()
            .then((win) => {
                const currentState = win.history.state || {};
                const nextIdx = typeof currentState.idx === 'number' ? currentState.idx + 1 : 1;
                win.history.pushState(
                    { usr: { date: flowDateIso }, key: `carpark-back-test-${Date.now()}`, idx: nextIdx },
                    '',
                    '/carpark'
                );
                win.dispatchEvent(new win.PopStateEvent('popstate'));
            });

        cy.location('pathname').should('eq', '/carpark');
        cy.get('button#generic_back_button').should('be.visible').click();
        cy.location('pathname').should('eq', '/home');
    });

    it('renders back button in floor/desks flow and keeps context in sessionStorage', () => {
        const flowDateIso = new Date().toISOString();

        cy.login(Cypress.env('TEST_USER_MAIL'), Cypress.env('TEST_USER_PW'))
            .url()
            .should('include', '/home')
            .window()
            .then((win) => {
                const currentState = win.history.state || {};
                const nextIdx = typeof currentState.idx === 'number' ? currentState.idx + 1 : 1;
                win.history.pushState(
                    { usr: { date: flowDateIso }, key: `back-test-${Date.now()}`, idx: nextIdx },
                    '',
                    '/floor'
                );
                win.dispatchEvent(new win.PopStateEvent('popstate'));
            });

        cy.location('pathname').should('eq', '/floor');
        cy.get('button#generic_back_button').should('be.visible');

        cy.setFloor(buildingId, floorId, imgSrc)
            .get(`button#icon_button_${roomRemark}`)
            .click();

        cy.location('pathname').should('eq', '/desks');
        cy.get('button#generic_back_button').should('be.visible');

        cy.get('p').contains(`${deskRemark}`).click({ force: true });

        cy.get('button#generic_back_button').click();
        cy.location('pathname').should('eq', '/floor');

        cy.intercept('GET', '**/bookings/bookingsForDesk/*').as('restoredDeskBookings');
        cy.setFloor(buildingId, floorId, imgSrc)
            .get(`button#icon_button_${roomRemark}`)
            .click();

        cy.location('pathname').should('eq', '/desks');
        cy.wait('@restoredDeskBookings');

        cy.window().then((win) => {
            const bookingContext = JSON.parse(win.sessionStorage.getItem('bookingNavigationContext') || '{}');
            expect(bookingContext.roomId).to.exist;
            expect(bookingContext.date).to.exist;

            const selectedKeys = Object.keys(win.sessionStorage).filter((key) => key.startsWith('bookingSelection:'));
            expect(selectedKeys.length).to.be.greaterThan(0);

            const selectedDesk = JSON.parse(win.sessionStorage.getItem(selectedKeys[0]) || '{}');
            expect(selectedDesk.deskId).to.exist;
        });
    });
});
