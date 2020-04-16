/* eslint-disable */

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



    it('Select, View Category from Hamburger Menu', function () {
        cy.get('.menu-cpt-wrapper > .button-icon').click()

        cy.get('.trigger').click()

        cy.get('.tree-wrp > :nth-child(1) > :nth-child(2) > :nth-child(1) > .sub-categories > :nth-child(1) > .trigger').click()

        cy.get('[href="/Outdoors-Home/"] > .button-primary').click()

        cy.url().should('include', '/Outdoors-Home/')
    })



    it('Select Product, Go to its product page', function () {
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



    it('Go back and add another product to cart', function () {
        cy.get('.overlay-header > .button-icon').click()

        cy.get('.detail-back-btn').click()

        cy.get(':nth-child(2) > .product-card').click()

        cy.get('.add-to-cart').click()

        cy.contains('Successfully added item to cart.')
        cy.contains('Shopping Cart')
        cy.contains('Keep shopping')
    })



    it('Go back with "Keep Shopping" btn & add another product to cart ', function () {
        cy.get('.shopping-button').click()

        cy.get('.detail-back-btn').click()

        cy.get(':nth-child(3) > .product-card').click()

        cy.get('.add-to-cart').click()
    })



    it('Go to Shopping Cart', function () {
        cy.get('.checkout-btn').click()

        cy.url().should('eq', 'http://localhost:3336/checkout/cart')
    })



    it('Go to Shopping Cart', function () {
        cy.get('.checkout-btn').click()
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
