/* eslint-disable */

import { viewPortSizes } from "./utils"


describe('Buy Product Flow', function () {
    viewPortSizes.forEach(viewport => {

        describe(`Tests for ${viewport.viewportWidth} w x ${viewport.viewportHeight} h`, function () {
            beforeEach(() => {
                cy.viewport(viewport.viewportWidth, viewport.viewportHeight)
            })



            it('logs in', function () {
                cy.acceptCookies()
                cy.login()
            })



            it('selects a category', function () {
                cy.pickCategory(viewport.desktop)
            })



            it('selects a product & adds to cart', function () {
                cy.get('.listing-wrp .listing-item .product-card')
                    .should('be.visible')
                    .pickRandomProduct()


                cy.get('.add-to-cart').click()


                cy.contains('Successfully added item to cart.')
                cy.contains('Shopping Cart')
                cy.contains('Keep shopping')
            })



            it('goes to shopping cart & goes to checkout', function () {
                cy.contains('Shopping Cart')
                    .should('exist')
                    .click()


                cy.url()
                    .should('include', '/checkout/cart')
                    .wait(800)


                cy.contains('Go to checkout')
                    .should('exist')
                    .click()


                cy.url()
                    .should('include', '/checkout/shopware-onepage')
            })



            it('selects a payment method', function () {
                cy.get('.payment-methods-wrp .method-wrp').then($paymentMethods => {
                    cy.wrap($paymentMethods)
                        .should('have.length', $paymentMethods.length)
                        .pickRandom()
                    })
            })



            it('selects a shipping method', function () {
                cy.get('.shipping-methods-wrp .method-wrp').then($shippingMethods => {
                    cy.wrap($shippingMethods)
                        .should('have.length', $shippingMethods.length)
                        .pickRandom()
                })
            })



            it.skip('places order', function () {
                cy.get('button')
                    .contains('Place Order')
                    .click()
            })



            it.skip('gets success message', function () {
                cy.url().should('include', '/checkout/shopware-success')

                cy.contains('Thank you for your order at hubble!')
            })
        })
    })
})

