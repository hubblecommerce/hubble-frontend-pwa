/* eslint-disable */

// TODO: add environment variables & update references

describe('Accept Cookies', function() {
    it('Click Accept', function() {
        cy.visit('')

        cy.get('.cookie-notice')
            .within(()=> {
                cy.get('.button-primary').click()
            })

    })
})


describe('Login Feature', function() {
    it('Click Login, no credentials', function () {
        cy.visit('')

        cy.get('.cookie-notice')
            .within(()=> {
                cy.get('.button-primary').click()
            })

        cy.get('.customer-account-cpt-wrp').click()

        cy.get('form').within(()=> {
            cy.get('.button-primary').click()
        })

        cy.contains('Email is required')
    })




    it('Login existing user', function () {
        cy.get('#email').type(Cypress.env('login-email'))
            .should('have.value', Cypress.env('login-email'))

        cy.get('#password').type(Cypress.env('login-pw'))
            .should('have.value', Cypress.env('login-pw'))

        cy.get('form').within(() => {
            cy.get('.button-primary').click()
        })

        cy.contains('Logout')
    })




    it('Logout logged in user', function () {
        cy.get('.logout-button').click().wait(500)
    })




    it('Check if user is logged out', function () {
        cy.get('.customer-account-cpt-wrp').click()

        cy.get('form').within(() => {
            cy.get('.button-primary').click()
        })

        cy.contains('Email is required')
    })



    it('Login existing user, wrong PW', function () {
        cy.visit('')

        cy.get('.cookie-notice')
            .within(()=> {
                cy.get('.button-primary').click()
            })

        cy.get('.customer-account-cpt-wrp').click()


        cy.get('#email').type(Cypress.env('login-email'))
            .should('have.value', Cypress.env('login-email'))

        cy.get('#password').type(Cypress.env('login-wrong-pw'))
            .should('have.value', Cypress.env('login-wrong-pw'))

        cy.get('form').within(() => {
            cy.get('.button-primary').click()
        })

        cy.contains('Login failed')
    })
})


