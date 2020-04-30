/* eslint-disable */

import { getExistingUserData, viewPortSizes } from "../support/utils"

const { loginEmail, loginPw, loginWrongPw } = getExistingUserData()


describe('Login Flow', function () {

    viewPortSizes.forEach(viewport => {
        describe(`Tests for ${viewport.viewportWidth} w x ${viewport.viewportHeight} h`, function () {

            beforeEach(() => {
                cy.viewport(viewport.viewportWidth, viewport.viewportHeight)
            })



            it('clicks login, no credentials entered', function () {
                cy.acceptCookies()

                cy.get('.customer-account-cpt-wrp button')
                    .click()

                cy.contains('Login')
                    .click()

                cy.contains('Email is required')
            })



            it('logs in existing user', function () {
                cy.login(loginEmail, loginPw, viewport.desktop)
            })



            it('logs out logged-in user', function () {
                cy.logout()
            })



            it('gets new password', function () {
                cy.get('.customer-account-cpt-wrp button')
                    .click()

                cy.get('#email')
                    .type(loginEmail)
                    .should('have.value', loginEmail)

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
                    .type(loginEmail)
                    .should('have.value', loginEmail)

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
