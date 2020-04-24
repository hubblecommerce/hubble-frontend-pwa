/* eslint-disable */

import { getGuestData, getRandomInRange, selectAnOption, viewPortSizes } from "./utils"



const { guestEmail, guestFirstName, guestLastName, guestStreet, guestZipCode, guestCity } = getGuestData()


describe('Buy Product Guest Flow', function () {

    viewPortSizes.forEach(viewport => {

        describe(`Tests for ${viewport.viewportWidth} w x ${viewport.viewportHeight} h`, function () {
            beforeEach(() => {
                cy.viewport(viewport.viewportWidth, viewport.viewportHeight)
            })



            it('selects a category', function () {
                cy.acceptCookies()


                if (viewport.desktop) {
                    cy.get('.menu-item').trigger('mouseenter')

                    cy.get('.children-wrp .child-wrp').pickRandomCategory()
                } else {
                    cy.get('.menu-cpt-wrapper button')
                        .should('have.class', 'navbar-toggler')
                        .click()


                    cy.get('.trigger').click()


                    cy.get('.tree-wrp > :nth-child(1) > :nth-child(2) > :nth-child(1) > .sub-categories > :nth-child(1) > .trigger').click()


                    cy.get('.button-primary').pickRandomCategory()
                }
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

                cy.url().should('include', '/checkout/login')

                cy.contains('Guest order')
                    .should('exist')
                    .click()

                cy.url().should('include', '/checkout/shopware-guest')
            })



            it('selects salutation', function () {
                cy.get(':nth-child(1)')
                    .get('.hbl-select')
                    .find('select')
                    .as('selectboxes')


                cy.get('@selectboxes')
                    .first()
                    .children()
                    .as('salutation')


                cy.get('@salutation').then(($salutations) => {
                    cy.get('@selectboxes')
                        .first()
                        .select(selectAnOption($salutations))
                })
            })



            it('enters guest customer data', function () {
                cy.get('#email')
                    .type(guestEmail)
                    .should('have.value', guestEmail)

                cy.get('#firstName')
                    .type(guestFirstName)
                    .should('have.value', guestFirstName)

                cy.get('#lastName')
                    .type(guestLastName)
                    .should('have.value', guestLastName)

                cy.get('#street')
                    .type(guestStreet)
                    .should('have.value', guestStreet)

                cy.get('#zipCode')
                    .type(guestZipCode)
                    .should('have.value', guestZipCode)

                cy.get('#city')
                    .type(guestCity)
                    .should('have.value', guestCity)
            })



            it('selects a country', function () {
                cy.get('.zip-city')
                    .find('select')
                    .children()
                    .as('countries')


                cy.get('@countries').then(($countries) => {
                    cy.get('.zip-city')
                        .find('select')
                        .select(selectAnOption($countries))
                })
            })



            it('selects a payment method', function () {
                cy.get('.payment-methods-wrp .method-wrp')
                    .should('have.length', 3)
                    .pickRandom()
            })



            it('selects a shipping method', function () {
                cy.get('.shipping-methods-wrp .method-wrp')
                    .should('have.length', 2)
                    .pickRandom()
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
