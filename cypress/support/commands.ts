/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import { Faker, de, en, base } from '@faker-js/faker'

export const customFaker = new Faker({
    // Now multiple fallbacks are supported
    locale: [de, en, base]
})

declare global {
    namespace Cypress {
        interface Chainable {
            selectRandomProduct (): Chainable<void>
            addToCart (): Chainable<void>
            addToWishlist (): Chainable<void>
            openWishlist(): Chainable<void>
            fillRegisterForm (): Chainable<void>
            acceptToC (): Chainable<void>
            fillAddressForm (formSelector): Chainable<void>
            loginCustomer (email: string, pw: string): Chainable<void>
            waitForHydration (timeout?: number): Chainable<void>
            selectFirstCategory (): Chainable<void>
        }
    }
}

Cypress.Commands.add('waitForHydration', (timeout = 10000) => {
    cy.log('Waiting for hydration ...')
    cy.contains('hydration: true', { log: false, timeout })
})

Cypress.Commands.add('selectFirstCategory', () => {
    if (Cypress.config('viewportWidth') < Cypress.env('mobileViewportWidthBreakpoint')) {
        cy.get('.navbar-start .dropdown .btn-ghost').click()
        cy.get('.menu.menu-compact > li:first > details > summary > a').click()
    } else {
        cy.get('.menu.menu-horizontal > li:first > details > summary > a').click()
    }
})

Cypress.Commands.add('selectRandomProduct', () => {
    cy.selectFirstCategory()

    let count
    cy.get('.grid .card').then(($value) => {
        count = $value.length
        const randomIndex = Math.floor(Math.random() * parseInt(count)) + 1
        cy.get(`.grid .card:nth-child(${randomIndex})`).contains('Details').click()
    })
})

Cypress.Commands.add('addToCart', () => {
    cy.intercept({
        method: 'POST',
        url: '/store-api/checkout/cart/line-item'
    }).as('apiAddLineItem')

    cy.wait(500)
    cy.get('.card-actions').contains('Add to cart').click()
    cy.wait('@apiAddLineItem')
})

Cypress.Commands.add('addToWishlist', () => {
    cy.intercept({
        method: 'POST',
        url: '/store-api/customer/wishlist'
    }).as('addToWishlist')

    cy.wait(500)
    cy.get('.card-body > .btn.btn-circle').click()
    cy.wait('@addToWishlist')
})

Cypress.Commands.add('openWishlist', () => {
    cy.intercept({
        method: 'POST',
        url: '/store-api/customer/wishlist'
    }).as('getCustomerWishlist')

    cy.get('.navbar-end > .btn:nth-last-child(2)').click()
    cy.wait('@getCustomerWishlist')
})

Cypress.Commands.add('fillAddressForm', (formSelector) => {
    cy.get(formSelector).within(($form) => {
        cy.get('[id$=-salutation]').select(0)
        cy.get('[id$=-firstName]').type(customFaker.person.firstName())
        cy.get('[id$=-lastName]').type(customFaker.person.lastName())
        cy.get('[id$=-street]').type(`${customFaker.location.street()} ${customFaker.number.int({ max: 100 })}`)
        cy.get('[id$=-zipcode]').type(customFaker.location.zipCode())
        cy.get('[id$=-city]').type(customFaker.location.city())
        cy.get('[id$=-country]').select(0)
    })
})

Cypress.Commands.add('fillRegisterForm', () => {
    cy.get('form.customer-register-form').within(($form) => {
        cy.get('#register-email').type(customFaker.internet.exampleEmail())
        cy.get('#registerShippingAddress-salutation').select(0)
        cy.get('#registerShippingAddress-firstName').type(customFaker.person.firstName())
        cy.get('#registerShippingAddress-lastName').type(customFaker.person.lastName())
        cy.get('#registerShippingAddress-street').type(`${customFaker.location.street()} ${customFaker.number.int({ max: 100 })}`)
        cy.get('#registerShippingAddress-zipcode').type(customFaker.location.zipCode())
        cy.get('#registerShippingAddress-city').type(customFaker.location.city())
        cy.get('#registerShippingAddress-country').select(0)
    })
})

Cypress.Commands.add('acceptToC', () => {
    cy.contains('I agree to the terms and conditions as set out by the user agreement.').click()
    cy.contains('I have read the privacy policy and I agree with them.').click()
})

Cypress.Commands.add('loginCustomer', (email: string, pw: string) => {
    cy.intercept({
        method: 'POST',
        url: '/store-api/account/login'
    }).as('apiLoginCustomer')

    cy.intercept({
        method: 'POST',
        url: '/store-api/customer/wishlist'
    }).as('apiGetWishlist')

    cy.visit('/')
    cy.waitForHydration()
    // click on customer navigation icon
    cy.get('.navbar-end > div:nth-child(3) > a').click()

    cy.get('form').within(($form) => {
        cy.get('#username').type(email)
        cy.get('#password').type(pw)

        cy.get('.btn.btn-primary').contains('Login').click()
    })

    cy.wait('@apiLoginCustomer')
    cy.wait('@apiGetWishlist')

    // wait for logged state isset in app
    cy.get('.navbar-end > div:nth-child(3) .text-success svg')
})
