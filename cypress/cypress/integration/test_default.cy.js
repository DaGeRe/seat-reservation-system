describe('', ()=>{
    const pw1 = 'pw';
    const vorname1 = 'max';
    const nachname = 'mustermann';
    const mail = 'foo@bar.com'
    const building = 'Außenstelle Chemnitz';
    const floor = '4. Dachgeschoss';
    beforeEach(()=>{
        cy.login().then(()=>{
            cy.getAmountOfUsersForMail(mail).then((ret)=>{
                if (ret > 0) {
                    cy.deleteUser(mail).then(()=>{})
                }
                cy.addUser(mail, pw1, vorname1, nachname).then(()=>{return;});
            })
        });
    })

    it('test set the default building and floor as normal user', ()=>{
        cy.login(mail, pw1).then(()=>{
            cy.get('a#sidebar_settings0').click(()=>{
                cy.get('a#sidebar_settings').should('exist').click().then(()=>{
                    cy.get('div#settings_floorSelector_setBuilding').click().then(()=>{
                    cy.get('li#settings_building_2').click().then(()=>{
                            cy.get('div#settings_floorSelector_setFloor').click().then(()=>{
                                cy.get('li#settings_floor_8').click().then(()=>{
                                    cy.get('button#settings_btn_onConfirm').click().then(()=>{
                                        cy.get('.Toastify__toast').should('be.visible').contains('Settings successful updated.').then(()=>{
                                            cy.logout().then(()=>{
                                                cy.login(mail, pw1).then(()=>{
                                                    cy.get('a#sidebar_settings').should('exist').click().then(()=>{
                                                        cy.get('div#settings_select-floor').should('have.text', floor).then(()=>{
                                                            cy.visit("/floor").then(()=>{
                                                                cy.get('div#Floor_FloorImage_select-building').should('have.text', building).then(()=>{
                                                                    cy.get('div#Floor_FloorImage_select-floor').should('have.text', floor).then(()=>{
                                                                        cy.wrap('1');                                                                   
                                                                    })
                                                                });
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
                    })
                });
            })
        });
    })
})