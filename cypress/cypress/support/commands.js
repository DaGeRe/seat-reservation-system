Cypress.Commands.add('selectTimeRange', (startSlot, endSlot) => {
  const basename = '.rbc-time-content';
  const timeslotgroupname = 'div.rbc-time-slot';

  cy.get(basename).then(($el_base) => {
    const base_rect = $el_base[0].getBoundingClientRect();
    const base_rect_x = base_rect.x;
    const base_rect_y = base_rect.y;

    // The height of every element with class rbc-timeslot-group
    const timeslotgroup_height = 19.5;//timeslotgroup_rect.height;
    // Offset to jump over the time header (6:00 AM etc)
    const time_offset_x = 100;

    const pos_x = base_rect_x + time_offset_x;
    const pos_y = base_rect_y + startSlot*timeslotgroup_height

    cy.get(basename).trigger('mousemove', { force: true, 
      pageX: pos_x, 
      pageY: pos_y
    }).then(()=>{
      cy.get(basename).trigger('mousedown', { which: 1, force: true }).then(()=>{
        for (let i = 0; i < (endSlot-startSlot)*timeslotgroup_height; i++) {
          cy.get('.rbc-time-content').trigger('mousemove', { force: true,
            pageX: pos_x, 
            pageY: pos_y + i, 
          });
          cy.wait(1);
        }
        cy.get(basename).trigger('mouseup', { which: 1, force: true })
        .then(()=>{
          return cy.wrap('1');
        }); 
      }) 
    });
  });
});

Cypress.Commands.add('setStr', (id, str) => {
  cy.get(`div#${id}`).find('input').should('exist').then(()=>{
    cy.get(`div#${id}`).find('input')
    .then(($input) => {
        const input = $input[0];
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            'value'
        ).set;
        nativeInputValueSetter.call(input, str);

        // Trigger events.
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));

        //cy.wrap(input).should('have.value', str);
        cy.get(`div#${id}`).find('input').should('have.value', str)
        .then(()=>{
          return cy.wrap('1');
        });
    });
  });
});

Cypress.Commands.add('highlightMousePosition', () => {
  cy.document().then((doc) => {
    const mouseTracker = doc.createElement('div');
    mouseTracker.setAttribute('id', 'mouse-tracker');
    Object.assign(mouseTracker.style, {
      position: 'absolute',
      width: '10px',
      height: '10px',
      backgroundColor: 'red',
      borderRadius: '50%',
      zIndex: 9999,
      pointerEvents: 'none',
    });
    doc.body.appendChild(mouseTracker);

    doc.addEventListener('mousemove', (event) => {
      mouseTracker.style.left = `${event.pageX}px`;
      mouseTracker.style.top = `${event.pageY}px`;
    });
  });
});

Cypress.Commands.add('logout', ()=>{
  cy.wait(1000).then(()=>{
    cy.get('a#sidebar_logout').click().then(()=>{
      cy.get('button#logoutConfirmationModal_onConfirm').click().then(()=>{
        return cy.wrap('1');
      });
    });
  });
});

Cypress.Commands.add('login', (mail='test@mail.com', pw='test') => {
  cy.visit('/').then(()=>{
    cy.intercept('POST', '/users/login').as('loginRequest');
    Cypress.Promise.all([
      cy.get('[data-testid="email"]').type(mail),
      cy.get('[data-testid="password"]').type(pw)
    ]).then(()=>{
      cy.get('[data-testid="loginBtn"]').click().then(()=>{
        cy.wait('@loginRequest').then((interception) => {
          const response = interception.response;
          expect(response === null).to.equal(false);
          const statusCode = response.statusCode;
          expect(statusCode).to.equal(200);
          const body = response.body;
          const accessToken = response.body.accessToken;
          expect(accessToken === null).to.equal(false);
          cy.get('[data-testid="loginErrorMsg"]').should('not.exist').then(()=>{
            return cy.wrap('1');
          });
          /*
          cy.get('[data-testid="loginErrorMsg"]').should('not.exist');
          // Token im lokalen Speicher speichern
          cy.window().then((window) => {
            window.localStorage.setItem('headers', JSON.stringify({
            'Authorization': 'Bearer ' +  String(accessToken),
            'Content-Type': 'application/json',
            }));
            return cy.wrap('1');
          });
          */
        });
      });
    }); 
  });  
});

Cypress.Commands.add('addUser', (mail, pw, vorname, nachname)=>{
  cy.login().then(()=>{
    cy.visit('/admin').then(()=>{
        cy.url().should('contains', '/admin').then(()=> {
            cy.get('button#userManagement').click().then(()=>{
                cy.get('div.employee-button-wrapper').should('be.visible').then(()=>{
                    cy.get('button#addEmployee').click().then(()=>{
                        cy.get('h2#customized-dialog-title').should('be.visible').then(()=>{
                            Cypress.Promise.all([
                                cy.setStr('addEmployee-setEmail', mail),
                                cy.setStr('addEmployee-setPassword', pw),
                                cy.setStr('addEmployee-setName', vorname),
                                cy.setStr('addEmployee-setSurname', nachname)
                            ]).then(()=>{
                                cy.contains('button', /SUBMIT/).click().then(()=>{
                                  cy.wait(1000)./*cy.screenshot('a').*/then(()=>{
                                    cy.wait(1000).then(()=>{  
                                      cy.logout().then(()=>{
                                            return cy.wrap('1');
                                        });
                                    })
                                  })
                                });
                            });;
                        });
                    });
                });
            });
        });
    });
  });
});

Cypress.Commands.add('deleteUser', (mail)=>{
  cy.login().then(()=>{
    cy.visit('/admin').then(()=>{
      cy.url().should('contains', '/admin').then(()=> {
          cy.get('button#userManagement').click().then(()=>{
              cy.get('div.employee-button-wrapper').should('be.visible').then(()=>{
                  cy.get('button#deleteEmployee').click().then(()=>{
                      cy.get('input#checkbox_handleCheckboxChange').click().then(()=>{
                          Cypress.Promise.all([
                              cy.setStr('filterEmployee_handleFieldChange', 'email'),
                              cy.setStr('filterEmployee_handleConditionChange', 'is_equal'),
                              cy.setStr('filterEmployee_handleTextChange', mail)
                          ]).then(()=>{
                              cy.get('tr').find('button').click().then(()=>{       
                                  return cy.wrap('1');
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

Cypress.Commands.add('getAmountOfUsersForMail', (mail) => {
  cy.login().then(()=>{
    cy.visit('/admin').then(()=>{
      cy.url().should('contains', '/admin').then(()=> {
        cy.get('button#userManagement').click().then(()=>{
          cy.get('div.employee-button-wrapper').should('be.visible').then(()=>{
            cy.get('button#deleteEmployee').click().then(()=>{
              cy.get('input#checkbox_handleCheckboxChange').click().then(()=>{
                Cypress.Promise.all([
                  cy.setStr('filterEmployee_handleFieldChange', 'email'),
                  cy.setStr('filterEmployee_handleConditionChange', 'is_equal'),
                  cy.setStr('filterEmployee_handleTextChange', mail)
                ]).then(()=>{
                  cy.wait(1000).then(()=>{
                    const length = Cypress.$(`tr`).length - 1;
                    cy.get('button#deleteEmployee_handleClose').click().then(()=>{
                      cy.logout().then(()=>{
                        return cy.wrap(length);
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
  });
});

Cypress.Commands.add('rmAllRooms', (building, floor, roomRemark)=>{
  cy.login().then(()=>{
    cy.visit('/admin').then(()=>{
      cy.url().should('contains', '/admin').then(()=> {
        cy.get('button#roomManagement').click().then(()=>{
          cy.get('button#deleteRoom').click().then(()=>{
            Cypress.Promise.all([
              cy.setStr('floorselector_setBuilding', building),
              cy.setStr('floorselector_setFloor', floor),
            ]
            ).then(()=>{
              cy.wait(1000).then(()=>{
                Cypress.$(`button#icon_button_${roomRemark}`).each((_, el)=>{
                  cy.wrap(el).click().then(()=>{
                    cy.wait(1000).then(()=>{
                      const delete_ff_btn_yes = Cypress.$('button#delete_ff_btn_yes');
                      if (0 !== delete_ff_btn_yes.length) {
                        cy.get('button#delete_ff_btn_yes').click().then(()=>{
                        })
                      }
                      
                    })
                  })
                })
                return cy.wrap('1');
              })
            })
          })
        })
      })
    })
  })
});
Cypress.Commands.add('addDesk', (building, floor, roomRemark, deskRemark) => {
  cy.login().then(()=>{
    cy.visit('/admin').then(()=>{
      //cy.wait(1000).then(()=> {
      cy.url().should('contains', '/admin').then(()=> {
        cy.get('button#roomManagement').click().then(()=>{
          cy.get('button#addWorkstation').click().then(()=>{
            Cypress.Promise.all([
              cy.setStr('floorselector_setBuilding', building),
              cy.setStr('floorselector_setFloor', floor)
            ]).then(()=>{
              cy.wait(1000).then(()=>{
                cy.get(`button#icon_button_${roomRemark}`).click().then(()=>{ 
                  cy.wait(1000).then(()=>{
                    Cypress.Promise.all([
                      cy.setStr('workstationDefinition_setEquipment', 'with equipment'),
                      cy.setStr('workStationDefinition_setRemark', deskRemark)
                    ]).then(()=>{
                      cy.get('button#desk_submit_btn').click().then(()=>{
                        return cy.wrap('1');
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

Cypress.Commands.add('rmDesk', (building, floor, roomRemark, deskRemark) => {
  cy.login().then(()=>{
    cy.visit('/admin').then(()=>{
      //cy.wait(1000).then(()=> {
      cy.url().should('contains', '/admin').then(()=> {
        cy.get('button#roomManagement').click().then(()=>{
          cy.get('button#deleteWorkstation').click().then(()=>{
            Cypress.Promise.all([
              cy.setStr('floorselector_setBuilding', building),
              cy.setStr('floorselector_setFloor', floor)
            ]).then(()=>{
              cy.wait(1000).then(()=>{
                cy.get(`button#icon_button_${roomRemark}`).click().then(()=>{ 
                  cy.wait(1000).then(()=>{
                    //cy.screenshot('a');
                    cy.get('div#textfield_desk_in_room').click().then(()=>{
                      cy.get('div').contains(`${deskRemark}`).click().then(()=>{
                        cy.get('button#delete_workstation_button').click().then(()=>{
                          cy.wait(1000).then(()=>{
                            const delete_ff_btn_yes = Cypress.$('button#delete_ff_btn_yes');
                            if (0 !== delete_ff_btn_yes.length) {
                              cy.get('button#delete_ff_btn_yes').click().then(()=>{
                                return cy.wrap('1');
                              })
                            }
                            else {
                              return cy.wrap('1');
                            }
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
});

Cypress.Commands.add('addRoom', (building, floor, remark) => {
  cy.login().then(()=>{
    cy.visit('/admin').then(()=>{
      cy.url().should('contains','/admin').then(()=> {
        cy.get('button#roomManagement').click().then(()=>{
          cy.get('button#addRoom').click().then(()=>{
            Cypress.Promise.all([
              cy.setStr('floorselector_setBuilding', building),
              cy.setStr('floorselector_setFloor', floor),
              cy.setStr('roomDefinition_setType', 'Normal'),
              cy.setStr('roomDefinition_setStatus', 'enable'),
              cy.setStr('roomDefinition_setRemark', remark)
            ]).then(()=> {
              cy.get('div.image-container').click().then(()=>{
                cy.wait(1000).then(()=>{
                  cy.get('button#room_submit_btn').click().then(()=>{
                    return cy.wrap('1');
                  });
                });
              });
            });
          });
        });
      });
    });
  });  
});

Cypress.Commands.add('buildUp', (building, floor, roomRemark, deskRemark)=>{
  cy.login().then(()=>{
    cy.visit('/floor').then(()=> {
      cy.wait(1000).then(()=> { // !
        cy.rmAllRooms(building, floor, roomRemark).then(()=>{
          cy.addRoom(building, floor, roomRemark).then(()=>{
            cy.addDesk(building, floor, roomRemark, deskRemark).then(()=>{
              return cy.wrap('1');
            })
          })
        })
      })
    })
  })
});

Cypress.Commands.add('tearDown', (building, floor, roomRemark)=>{
  cy.login().then(()=>{
    cy.visit('/floor').then(()=> {
      cy.wait(1000).then(()=> { // !
        cy.rmAllRooms(building, floor, roomRemark).then(()=>{
          return cy.wrap('1');
        })
      })
    })
  })
});

Cypress.Commands.add('rmRoom', (building, floor, remark)=>{
  cy.login().then(()=>{
    cy.visit('/admin').then(()=>{
      cy.url().should('contains', '/admin').then(()=> {
        cy.get('button#roomManagement').click().then(()=>{
          cy.get('button#deleteRoom').click().then(()=>{
            Cypress.Promise.all([
              cy.setStr('floorselector_setBuilding', building),
              cy.setStr('floorselector_setFloor', floor),
            ]
            ).then(()=>{
              cy.wait(1000).then(()=>{
                cy.get(`button#icon_button_${remark}`).click().then(()=>{ 
                  cy.wait(1000).then(()=>{
                    const delete_ff_btn_yes = Cypress.$('button#delete_ff_btn_yes');
                    if (0 !== delete_ff_btn_yes.length) {
                      cy.get('button#delete_ff_btn_yes').click().then(()=>{
                        return cy.wrap('1');
                      })
                    }
                    else {
                      return cy.wrap('1');
                    }
                  });
                });
              });
            });
          });
        })
      });
    });
  }); 
});
Cypress.Commands.add('countBookings', (roomRemark) => {
  cy.login().then(()=>{
    cy.visit('/admin').then(()=>{
        cy.url().should('contains', '/admin').then(()=> {
        cy.get('button#bookingManagement').click().then(()=>{
          cy.wait(2000).then(()=>{
            cy.get('button#overviewBooking').click().then(()=>{
              cy.wait(2000).then(()=>{
                Cypress.Promise.all([
                  cy.setStr('overviewBookings_setFilter','/roomRemark/'),
                  cy.setStr('textfield_overviewbooking', roomRemark)
                ]).then(()=>{
                  cy.wait(3000).then(()=>{
                    cy.get('table tr').then((rows) => {
                      cy.wait(3000).then(()=>{
                      // -1 cause the head of the table also contains a row
                        return cy.wrap(rows.length - 1);
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
Cypress.Commands.add('addBooking', (building, floor, roomRemark, deskRemark, start_timeslot, end_timeslot) => {
  cy.login().then(()=>{
    cy.visit('/floor').then(()=>{
        cy.url().should('contains', '/floor').then(()=> {
        Cypress.Promise.all([
          cy.setStr('floorselector_setBuilding', building),
          cy.setStr('floorselector_setFloor', floor)
        ]).then(()=>{
          cy.wait(1000).then(()=>{
            cy.get(`button#icon_button_${roomRemark}`).click().then(()=>{
              cy.wait(1000).then(()=>{
                cy.get('div').contains(`${deskRemark}`).click().then(()=>{
                  cy.selectTimeRange(start_timeslot, end_timeslot).then(()=>{
                    cy.get('button.submit-btn').click().then(()=>{
                      return cy.wrap('1');
                    })
                  })
                })        
              })                
            })
          })
        })
      }) // wait        
    }) // visit
  }) // login
});