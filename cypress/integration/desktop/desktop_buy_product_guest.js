/* eslint-disable */

// TODO: add environment variables & update references

describe('Buy products', function() {
    it('Select, View Category from Menu', function () {
        cy.visit('')

        cy.get('.cookie-notice')
            .within(()=> {
                cy.get('.button-primary').click()
            })


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



    it('Select Guest Order', function () {
        cy.get('.button-primary').click()

        cy.url().should('eq', 'http://localhost:3336/checkout/login')

        cy.get('.guest-login-wrp > .button-secondary').click()

        cy.url().should('eq', 'http://localhost:3336/checkout/shopware-guest')
    })



    it('Enter Customer Information for Guest Checkout', function () {
        cy.get(':nth-child(1) > .select-text').select('Mrs.')

        cy.get('#email').type('')
            .should('have.value', '')

        cy.get('#firstName').type('')
            .should('have.value', '')

        cy.get('#lastName').type('')
            .should('have.value', '')

        cy.get('#street').type('')
            .should('have.value', '')

        cy.get('#zipCode').type('')
            .should('have.value', '')

        cy.get('#city').type('')
            .should('have.value', '')

        // country select box:
        cy.get('.form-row > .hbl-select > .select-text').select('')
    })



    it('Select Payment & Shipping Methods and Order', function () {
        cy.get('.payment-methods-wrp > :nth-child(2)').click()

        cy.get('.shipping-methods-wrp > :nth-child(2)').click()

        cy.get('.button-primary').click()

        cy.url().should('eq', 'http://localhost:3336/checkout/shopware-success')

        cy.contains('Thank you for your order at hubble!')
    })
})
