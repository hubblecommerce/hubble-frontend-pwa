/* eslint-disable */

const { _ } = Cypress


import { getRandomInRange, register} from "./utils";



Cypress.Commands.add("acceptCookies", () => {
    cy.visit('')


    cy.get('.cookie-notice')
        .should('be.visible')
        .find('.cookie-notice-button-wrp')
        .click()


    cy.get('.cookie-notice')
        .should('not.exist')
})



Cypress.Commands.add("login", (email, password, desktop) => {
    if (!desktop) cy.get('.customer-account-cpt-wrp').click()


    register(true, desktop, email, password)

    cy.get('#email')
        .type(email)
        .should('have.value', email)


    cy.get('#password')
        .type(password)
        .should('have.value', password)


    cy.get('form')
        .find('button')
        .contains('Login')
        .click()


    cy.contains('Logout')

    // todo: simplify selector? -> icon -> no visible text
    cy.get('.overlay-header > .button-close-menu > .icon').click()
})



Cypress.Commands.add("logout", () => {
    cy.get('.customer-account-cpt-wrp').click()


    cy.get('.link-wrp')
        .find('button')
        .contains('Logout')
        .click()


    cy.get('.container')
        .contains('Customer Account')
        .should('not.exist')
})



Cypress.Commands.add("pickRandom", { prevSubject: true }, (subject) => {
    cy.wrap(subject)
        .eq(getRandomInRange(subject.length))
        .find('label')
        .click()
})



Cypress.Commands.add("pickRandomProduct", { prevSubject: true }, (subject) => {
    cy.wrap(subject)
        .eq(getRandomInRange(subject.length))
        .click()
})



Cypress.Commands.add("pickRandomCategory", { prevSubject: true }, (subject) => {
    cy.wrap(subject)
        .eq(getRandomInRange(subject.length))
        .wait(800)
        .click()
})



Cypress.Commands.add("pickRandomMenuItem", { prevSubject: true }, (subject) => {
    cy.wrap(subject)
        .eq(getRandomInRange(subject.length))
        .wait(800)
})


// todo: simplify selectors?
Cypress.Commands.add("pickCategory", (desktop = true) => {
    if (desktop) {
        cy.get('.menu-item').pickRandomMenuItem().trigger('mouseenter')


        cy.get('.children-wrp .child-wrp').pickRandomCategory()
    } else {
        cy.get('.menu-cpt-wrapper button')
            .should('have.class', 'navbar-toggler')
            .click()


        cy.get('.trigger').pickRandomMenuItem().click()


        cy.get('.sub-categories .sub-categories .trigger').pickRandomMenuItem().click()


        cy.get('.button-primary').pickRandomCategory()
    }
})
