/* eslint-disable */

const loginEmail = Cypress.env('login-email')
const loginPw = Cypress.env('login-pw')

const _ = require('lodash')

const getRandomProductInRange = (numberOfProducts)  => _.random(1, numberOfProducts)


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

        cy.get('#email').type(loginEmail)
            .should('have.value', loginEmail)

        cy.get('#password').type(loginPw)
            .should('have.value', loginPw)

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
        cy.get('.listing-wrp')
            .should('be.visible')
            .children()
            .its('length')
            .as('productCount')


        cy.get('.listing-wrp')
            .should('be.visible')
            .children()
            .as('products')


        cy.get('@products')
            .eq(
                getRandomProductInRange('@productCount')
            )
            .click()
    })


    it('Add Product to cart', function () {
        cy.get('.add-to-cart').click()

        cy.contains('Successfully added item to cart.')
        cy.contains('Shopping Cart')
        cy.contains('Keep shopping')
    })



    it('Go to Shopping Cart', function () {
        cy.get('.checkout-btn').click()

        cy.url().should('include', '/checkout/cart')
    })
})
