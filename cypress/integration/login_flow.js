/* eslint-disable */

import { getRandomEmail, getRandomPw, getWrongPw, register, viewPortSizes} from "../support/utils"


describe('Login Flow', function () {

    viewPortSizes.forEach(viewport => {

        describe(`Tests for ${viewport.viewportWidth} w x ${viewport.viewportHeight} h`, function () {
            const emailArg = getRandomEmail()
            const pwArg = getRandomPw()
            const loginWrongPw = getWrongPw()

            beforeEach(() => {
                cy.viewport(viewport.viewportWidth, viewport.viewportHeight)
            })



            describe('log in new user', function () {
                register(true, viewport.desktop, emailArg, pwArg)


                it('clicks login, no credentials entered', function () {
                    cy.acceptCookies()

                    cy.get('.customer-account-cpt-wrp button')
                        .click()

                    cy.contains('Login')
                        .click()

                    cy.contains('Email is required')
                })


                it('logs in existing user', function () {
                    cy.login(emailArg, pwArg, viewport.desktop)
                })


                it('logs out logged-in user', function () {
                    cy.logout()
                })


                it('gets new password', function () {
                    cy.get('.customer-account-cpt-wrp button')
                        .click()

                    cy.get('#email')
                        .type(emailArg)
                        .should('have.value', emailArg)

                    cy.contains('Reset your Password')
                        .click()

                    cy.contains('Get new Password')
                        .click()
                })


                it('clicks login, with invalid pw', function () {
                    cy.acceptCookies()

                    cy.get('.customer-account-cpt-wrp button')
                        .click()

                    cy.contains('Login')
                        .click()


                    cy.get('#email')
                        .type(emailArg)
                        .should('have.value', emailArg)

                    cy.get('#password')
                        .type(loginWrongPw)
                        .should('have.value', loginWrongPw)


                    cy.contains('Login')
                        .click()

                    cy.get('.error-message').should('exist')

                    cy.contains('Login failed')
                })
            })
        })
    })

})
