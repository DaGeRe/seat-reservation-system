describe('', ()=>{
    const pw1 = 'pw';
    const pw2 = pw1+2;
    const vorname1 = 'max';
    const vorname2 = vorname1+1;
    const nachname = 'mustermann';
    const mail = 'foo@bar.com'

    beforeEach(()=>{
        //cy.task('log', 'beforeEach 1');
        cy.getAmountOfUsersForMail(mail).then((ret)=>{
            //cy.task('log', 'beforeEach 1.1');
            if (ret > 0) {
                cy.deleteUser(mail).then(()=>{})
            }
            //cy.task('log', 'beforeEach 2');
            cy.addUser(mail, pw1, vorname1, nachname)
            //cy.task('log', 'beforeEach 3');
        })
    })

    afterEach(()=>{
        cy.getAmountOfUsersForMail(mail).then((ret)=>{
            //cy.task('log', 'ret ' + ret);
            if (ret > 0) {
                cy.deleteUser(mail);
            }
        });
    });

    it('test change password', ()=>{
        cy.login(mail, pw1).then(()=>{
            // No admin
            cy.contains('span', 'Admin').should('not.exist').then(()=>{
            // Change pw
            cy.contains('span', 'Password').click().then(()=>{
                Cypress.Promise.all([
                    cy.setStr('changePassword_prevPassword', pw1),
                    cy.setStr('changePassword_newPassword', pw2),
                    cy.setStr('changePassword_newPasswordAgain', pw2)
                ]).then(()=>{
                    cy.get('button#changePassword_submit').click().then(()=>{
                        cy.logout().then(()=>{
                            cy.login(mail, pw2).then(()=>{
                                // No admin
                                cy.contains('span', 'Admin').should('not.exist').then(()=>{
                                    // Rechange pw
                                    cy.contains('span', 'Password').click().then(()=>{
                                        Cypress.Promise.all([
                                            cy.setStr('changePassword_prevPassword', pw2),
                                            cy.setStr('changePassword_newPassword', pw1),
                                            cy.setStr('changePassword_newPasswordAgain', pw1)
                                        ]).then(()=>{
                                            cy.get('button#changePassword_submit').click().then(()=>{
                                                cy.logout().then(()=>{
                                                    
                                                    cy.login(mail, pw1).then(()=>{
                                                        // No admin
                                                        cy.contains('span', 'Admin').should('not.exist').then(()=>{});
                                                        //cy.screenshot('mezz3');
                                                        //cy.deleteUser(mail);
                                                    })
                                                })
                                            })
                                        });
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
it('test change name', ()=>{
    cy.login().then(()=>{
        cy.visit('/admin').then(()=>{
            cy.url().should('contains', '/admin').then(()=> {
                cy.get('button#userManagement').click().then(()=>{
                    cy.get('div.employee-button-wrapper').should('be.visible').then(()=>{
                        cy.get('button#editEmployee').click().then(()=>{
                            cy.get('input#checkbox_handleCheckboxChange').click().then(()=>{
                                Cypress.Promise.all([
                                    cy.setStr('filterEmployee_handleFieldChange', 'email'),
                                    cy.setStr('filterEmployee_handleConditionChange', 'is_equal'),
                                    cy.setStr('filterEmployee_handleTextChange', mail)
                                ]).then(()=>{
                                    cy.get('tr').find('button').click().then(()=>{
                                        cy.setStr('editEmployeeModal-setName', vorname2).then(()=>{
                                            cy.get('button#editEmployeeModal_updateEmployee').click().then(()=>{
                                                cy.get('button#editEmployee_handleClose').click().then(()=>{
                                                    cy.logout().then(()=>{
                                                        cy.login(mail, pw1).then(()=>{
                                                            cy.contains('span',`Hello, ${vorname2}`).should('exist').then(()=>{
                                                                //cy.screenshot('fbf');
                                                                //cy.deleteUser(mail);
                                                                // No admin
                                                                cy.contains('span', 'Admin').should('not.exist').then(()=>{});
                                                            })
                                                        });
                                                    });
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
    
});