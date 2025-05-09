describe('', ()=>{
    const pw1 = Cypress.env('TEST_USER_PW');
    const pw2 = pw1+2;
    const vorname1 = 'max';
    const vorname2 = vorname1+1;
    const nachname = 'mustermann';
    const mail = 'user.mail@lit.justiz.sachsen.de';

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
    
    it('test register with same mail', ()=>{
        cy.login().then(()=>{
            cy.visit('/admin').then(()=>{
                cy.url().should('contains', '/admin').then(()=> {
                    cy.get('button#userManagement').click().then(()=>{
                        //cy.get('div.employee-button-wrapper').should('be.visible').then(()=>{
                            cy.get('button#addEmployee').click().then(()=>{
                                cy.get('h2').should('be.visible').then(()=>{//cy.get('h2#customized-dialog-title').should('be.visible').then(()=>{
                                    Cypress.Promise.all([
                                        cy.setStr('addEmployee-setEmail', mail),
                                        cy.setStr('addEmployee-setPassword', pw1),
                                        cy.setStr('addEmployee-setName', vorname1),
                                        cy.setStr('addEmployee-setSurname', nachname)
                                    ]).then(()=>{
                                        cy.get('button#modal_submit').click().then(()=>{//cy.contains('button', /SUBMIT/).click().then(()=>{
                                                cy.get('.Toastify__toast').should('be.visible').contains('Creation was not successful. Is the email already used?').then(()=>{
                                                return cy.wrap('1');
                                            })
                                        });
                                    });;
                                });
                            });
                        //});
                    });
                });
            });
        });
    })
    it('test change password', ()=>{
        cy.login(mail, pw1).then(()=>{
            // No admin
            cy.contains('span', 'Admin').should('not.exist').then(()=>{
                // Change pw
                cy.get('a#sidebar_settings0').click().then(()=>{
                cy.contains('span', 'Password').click().then(()=>{
                    Cypress.Promise.all([
                        cy.setStr('changePassword_prevPassword', pw1),
                        cy.setStr('changePassword_newPassword', pw2),
                        cy.setStr('changePassword_newPasswordAgain', pw2)
                    ]).then(()=>{
                        cy.get('button#modal_submit').click().then(()=>{
                            cy.get('.Toastify__toast').should('be.visible').contains('Password changed successfully').then(()=>{ //cy.screenshot('c');
                                cy.logout().then(()=>{
                                    cy.login(mail, pw2).then(()=>{
                                        // No admin
                                        cy.contains('span', 'Admin').should('not.exist').then(()=>{
                                            // Rechange pw
                                            cy.get('a#sidebar_settings0').click().then(()=>{
                                                cy.contains('span', 'Password').click().then(()=>{
                                                    Cypress.Promise.all([
                                                        cy.setStr('changePassword_prevPassword', pw2),
                                                        cy.setStr('changePassword_newPassword', pw1),
                                                        cy.setStr('changePassword_newPasswordAgain', pw1)
                                                    ]).then(()=>{
                                                        cy.get('button#modal_submit').click().then(()=>{
                                                            cy.logout().then(()=>{                    
                                                                cy.login(mail, pw1).then(()=>{
                                                                    // No admin
                                                                    cy.contains('span', 'Admin').should('not.exist').then(()=>{
                                                                        cy.logout().then(()=>{});
                                                                    });
                                                                })
                                                            })
                                                        })
                                                    });
                                                })
                                            })
                                        })
                                    })
                                });
                            });
                        })
                    }) 
                })
                })
            })
        });
    });

it('test change name', ()=>{
    cy.login().then(()=>{
        cy.visit('/admin').then(()=>{
            cy.url().should('contains', '/admin').then(()=> {
                cy.get('button#userManagement').click().then(()=>{
                    //cy.get('div.employee-button-wrapper').should('be.visible').then(()=>{
                        cy.get('button#editEmployee').click().then(()=>{
                            cy.get('input#checkbox_handleCheckboxChange').click().then(()=>{
                                Cypress.Promise.all([
                                    cy.setStr('filterEmployee_handleFieldChange', 'email'),
                                    cy.setStr('filterEmployee_handleConditionChange', 'is_equal'),
                                    cy.setStr('filterEmployee_handleTextChange', mail)
                                ]).then(()=>{
                                    cy.get('tr').find('button').click().then(()=>{
                                        cy.setStr('editEmployeeModal-setName', vorname2).then(()=>{
                                            cy.get('button#modal_submit').click().then(()=>{//cy.get('button#editEmployeeModal_updateEmployee').click().then(()=>{
                                                cy.get('.Toastify__toast').should('be.visible').contains('User updated successfully').then(()=>{
                                                    //cy.get('button#modal_close').click().then(()=>{//cy.get('button#editEmployee_handleClose').click().then(()=>{
                                                        cy.logout().then(()=>{
                                                            cy.login(mail, pw1).then(()=>{
                                                                cy.contains('span',`Hello, ${vorname2}`).should('exist').then(()=>{
                                                                    cy.contains('span', 'Admin').should('not.exist').then(()=>{
                                                                        
                                                                        cy.logout().then(()=>{});
                                                                    });
                                                                })
                                                            });
                                                        });
                                                    //});
                                                });
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    //})
                })
            })
        })
    })
})

});