/* eslint-disable */

// TODO: add environment variables & update references

describe('Buy products as guest', function() {
    it('Select, View Category from Hamburger Menu', function () {
        cy.visit('')

        cy.get('.cookie-notice')
            .within(()=> {
                cy.get('.button-primary').click()
            })

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



    it('Go to Shopping Cart', function () {
        cy.get('.checkout-btn').click()
    })



    it('Continue with Checkout', function () {
        cy.get('[href="/checkout/shopware-onepage"] > .button-primary').click()

        cy.url().should('eq', 'http://localhost:3336/checkout/login')

        cy.contains('Guest order').click()

        cy.url().should('eq', 'http://localhost:3336/checkout/shopware-guest')
    })



    it('Enter Guest Customer Information', function () {
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

        cy.get('.form-row > .hbl-select > .select-text').select('')
    })



    it('Select Payment Method', function () {
        cy.get('.payment-methods-wrp > :nth-child(2)').click()

        cy.get('.shipping-methods-wrp > :nth-child(2)').click()

        cy.get('.summary-wrp > .button-primary').click()

        cy.url().should('eq', 'http://localhost:3336/checkout/shopware-success')

        cy.contains('Thank you for your order at hubble!')
    })
})
