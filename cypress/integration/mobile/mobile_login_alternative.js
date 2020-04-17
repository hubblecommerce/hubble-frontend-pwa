/* eslint-disable */
describe('Login Feature', function() {
    beforeEach(() => {

    })


    it('Click Login, no credentials', function () {
        cy.visit('')

        cy.get('.cookie-notice')
            .within(() => {
                cy.get('.button-primary').click()
            })

        cy.get('.customer-account-cpt-wrp').click()

        cy.get('form').within(() => {
            cy.get('.button-primary').click()
        })

        cy.contains('Email is required')
    })
})
