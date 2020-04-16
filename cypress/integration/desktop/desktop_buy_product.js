/* eslint-disable */

// TODO: add environment variables & update references

describe('Buy products', function() {
    it('Login existing user', function () {
        cy.visit('')

        cy.get('.cookie-notice')
            .within(()=> {
                cy.get('.button-primary').click()
            })

        cy.get('.customer-account-cpt-wrp').click()

        cy.get('form').within(()=> {
            cy.get('.button-primary').click()
        })

        cy.get('#email').type(Cypress.env('login-email'))
            .should('have.value', Cypress.env('login-email'))

        cy.get('#password').type(Cypress.env('login-pw'))
            .should('have.value', Cypress.env('login-pw'))

        cy.get('form').within(() => {
            cy.get('.button-primary').click()
        })

        cy.contains('Logout')

        cy.get('.overlay-header > .button-icon > .icon').click()
    })



    it('Select, View Category from Menu', function () {
        cy.get('.menu-item').trigger('mouseenter')

        cy.get('.children-wrp').within(() => {
            cy.get('> :nth-child(1)').click()
        })
    })



    it('Select Product & Go to its product page', function () {
        cy.get(':nth-child(1) > .product-card').click()
    })



    it('Add Product to cart', function () {
        cy.get('.add-to-cart').click()

        cy.contains('Successfully added item to cart.')
        cy.contains('Shopping Cart')
        cy.contains('Keep shopping')
    })



    it('Change quantity of product', function () {
        cy.get('.quantity-selector').within(() => {
            cy.get('select').select('5').should('have.value', '5')
        })
    })



    it('Go to Shopping Cart & go to checkout', function () {
        cy.get('.button-primary').click()

        cy.url().should('eq', 'http://localhost:3336/checkout/cart').wait(800)
    })



    it('Go to Shopping Cart & go to checkout', function () {
        cy.get('.button-primary').click()

        cy.url().should('eq', 'http://localhost:3336/checkout/shopware-onepage')
    })



    it('Select Payment Method', function () {
        cy.get('.payment-methods-wrp > :nth-child(2)').click()

        cy.get('.shipping-methods-wrp > :nth-child(2)').click()

        cy.get('.summary-wrp > .button-primary').click()

        cy.url().should('eq', 'http://localhost:3336/checkout/shopware-success')

        cy.contains('Thank you for your order at hubble!')
    })
})
