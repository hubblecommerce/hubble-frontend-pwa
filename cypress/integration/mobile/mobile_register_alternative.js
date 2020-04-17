/* eslint-disable */

describe('Buy products', function() {
    it('checks checkbox for having a different shipping address', function () {
        cy.visit('/customer/login')

        cy.get('.tabs-component-tabs')
            .within(() => {
               cy.contains('Register').click()
            })


        cy.get('.tabs-component-panels')
            .contains('I am not having an account yet')


        cy.get('.different-shipping-address')
            .within(() => {
                cy.get('.hbl-checkbox > label')
                    .click()

                cy.get('.hbl-checkbox > input')
                    .should('be.checked')
            })


        cy.get('.shipping-addresses-wrp')
            .should('be.visible')


        cy.get('.different-shipping-address')
            .within(() => {
                cy.get('.hbl-checkbox > label')
                    .click()

                cy.get('.hbl-checkbox > input')
                    .should('not.be.checked')
            })


        cy.get('.shipping-addresses-wrp')
            .should('not.be.visible')
    })
})

