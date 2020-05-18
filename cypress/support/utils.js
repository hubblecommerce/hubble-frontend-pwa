/* eslint-disable */

const { _ } = Cypress



const faker = require('faker');



const  {
    registerBillingFirstName,
    registerBillingLastName,
    registerBillingStreet,
    registerBillingZipCode,
    registerBillingCity,

    registerShippingFirstName,
    registerShippingLastName,
    registerShippingStreet,
    registerShippingZipCode,
    registerShippingCity,
} = getNewUserData();



export const getRandomInRange = (numberOfElements)  => _.random(0, numberOfElements - 1);



export const selectAnOption = options => options[getRandomInRange(options.length)].text;



const resolutions = Cypress.env('resolutions');



const mobile = {
    viewportWidth: resolutions.mobile.viewportWidth,
    viewportHeight:resolutions.mobile.viewportHeight,
    desktop: resolutions.mobile.desktop,
}



const desktop = {
    viewportWidth: resolutions.desktop.viewportWidth,
    viewportHeight: resolutions.desktop.viewportHeight,
    desktop: resolutions.desktop.desktop,
}



export const viewPortSizes = [desktop, mobile];



export function getNewUserData () {
    faker.locale = "de";

    const registerBillingFirstName = faker.name.firstName();
    const registerBillingLastName = faker.name.lastName();
    const registerBillingStreet = faker.address.streetAddress();
    const registerBillingZipCode = faker.address.zipCode();
    const registerBillingCity = faker.address.city();

    const registerShippingFirstName = faker.name.firstName();
    const registerShippingLastName = faker.name.lastName();
    const registerShippingStreet = faker.address.streetAddress();
    const registerShippingZipCode = faker.address.zipCode();
    const registerShippingCity = faker.address.city();

    return {
        registerBillingFirstName,
        registerBillingLastName,
        registerBillingStreet,
        registerBillingZipCode,
        registerBillingCity,

        registerShippingFirstName,
        registerShippingLastName,
        registerShippingStreet,
        registerShippingZipCode,
        registerShippingCity,
    }
}



export function getRandomEmail () {
    const emailBase = Cypress.env('emailBase');

    faker.locale = "en";

    const randomSuffix = `${faker.name.firstName()}${faker.name.lastName()}`;

    return emailBase.replace('$placeholder', randomSuffix);
}



export const getRandomPw = () => faker.internet.password();



export const getWrongPw = () => "123";



export function getGuestData () {
    const guestEmail = getRandomEmail();

    faker.locale = "de";

    const guestFirstName = faker.name.firstName();
    const guestLastName = faker.name.lastName();
    const guestStreet = faker.address.streetAddress();
    const guestZipCode = faker.address.zipCode();
    const guestCity = faker.address.city();

    return {
        guestEmail,
        guestFirstName,
        guestLastName,
        guestStreet,
        guestZipCode,
        guestCity
    }
}




export function register(shippingAndBillingAddressAreTheSame = true, desktop = true, emailParam, pwParam) {
    it('accepts Cookies', function () {
        if (desktop) {
            cy.acceptCookies()
        } else {
            cy.visit('')
            cy.wait(200)
        }
    })


    it('goes to register form, enters data and submits it', function () {
        // todo: simplify selector? -> icon -> no visible text
        cy.get('.customer-account-cpt-wrp button').click()


        cy.get('.content-wrp')
            .find('button')
            .contains('Register')
            .click()


        cy.url().should('include', '/customer/login')



        if (desktop) {
            cy.get('.checkout-register-wrp')
                .find('button')
                .contains('Register')
                .click()
        } else {
            cy.get('.tabs-component-tab')
                .contains('Register')
                .click()


            cy.get('.tabs-component-panels')
                .contains('I am not having an account yet')
        }



        cy.get('#email')
            .type(emailParam)
            .should('have.value', emailParam)


        cy.get('#email-repeat')
            .type(emailParam)
            .should('have.value', emailParam)


        cy.get('#password')
            .type(pwParam)
            .should('have.value', pwParam)


        cy.get('#passwordRepeat')
            .type(pwParam)
            .should('have.value', pwParam)



        if (!shippingAndBillingAddressAreTheSame) {
            cy.contains('I have a different shipping address')
                .click()


            cy.get('.different-shipping-address > .hbl-checkbox > input')
                .should('be.checked')
        }



        // todo: simplify selector
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
                .wait(800)
                .select(selectAnOption($salutations))
        })


        cy.get('#billingFirstName')
            .type(registerBillingFirstName)
            .should('have.value', registerBillingFirstName)


        cy.get('#billingLastName')
            .type(registerBillingLastName)
            .should('have.value', registerBillingLastName)


        cy.get('#billingStreet')
            .type(registerBillingStreet)
            .should('have.value', registerBillingStreet)


        cy.get('#billingZipCode')
            .type(registerBillingZipCode)
            .should('have.value', registerBillingZipCode)


        cy.get('#billingCity')
            .type(registerBillingCity)
            .should('have.value', registerBillingCity)


        // todo: simplify selector
        cy.get('.billing-addresses-wrp')
            .find('select')
            .eq(1)
            .children()
            .as('availableCountries')


        cy.get('@availableCountries').then(($countries) => {
            cy.get('.billing-addresses-wrp select')
                .eq(1)
                .select(selectAnOption($countries))
        })



        if (!shippingAndBillingAddressAreTheSame) {
            // todo: simplify selector
            cy.get(':nth-child(2) select')
                .children()
                .eq(1)
                .as('availableSalutationsShipping')


            cy.get('@availableSalutationsShipping').then(($salutationsShipping) => {
                // todo: simplify selector
                cy.get(':nth-child(2) select')
                    .eq(2)
                    .select(selectAnOption($salutationsShipping))
            })


            cy.get('#shippingFirstName')
                .type(registerShippingFirstName)
                .should('have.value', registerShippingFirstName)


            cy.get('#shippingLastName')
                .type(registerShippingLastName)
                .should('have.value', registerShippingLastName)


            cy.get('#shippingStreet')
                .type(registerShippingStreet)
                .should('have.value', registerShippingStreet)


            cy.get('#shippingZipCode')
                .type(registerShippingZipCode)
                .should('have.value', registerShippingZipCode)


            cy.get('#shippingCity')
                .type(registerShippingCity)
                .should('have.value', registerShippingCity)


            // todo: simplify selector
            cy.get('.shipping-addresses-wrp select')
                .eq(1)
                .children()
                .as('countries')


            // todo: simplify selector
            cy.get('@countries').then(($countries) => {
                cy.get('.shipping-addresses-wrp select')
                    .eq(1)
                    .select(selectAnOption($countries))
            })
        }



        // todo: simplify selector
        cy.get('.hbl-checkbox > label')
            .eq(1)
            .click()


        cy.get('#privacyPolicy').should('be.checked')


        cy.get('button')
            .contains('Register')
            .click()
            .wait(800)


        cy.url().should('include', '/customer/dashboard')
    })
}
