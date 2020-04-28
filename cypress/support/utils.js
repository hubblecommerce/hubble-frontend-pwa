/* eslint-disable */

const { _ } = Cypress



const faker = require('faker/locale/de')



const  {
    registerEmailOne,
    registerPwOne,
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
} = getNewUserData()



export const getRandomInRange = (numberOfElements)  => _.random(0, numberOfElements - 1)



export const selectAnOption = options => options[getRandomInRange(options.length)].text



const resolutions = Cypress.env('resolutions')



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



export const viewPortSizes = [desktop, mobile]



export function getNewUserData () {
    const registerEmailOne = faker.internet.email()
    const registerPwOne =  faker.internet.password()

    const registerBillingFirstName = faker.name.firstName()
    const registerBillingLastName = faker.name.lastName()
    const registerBillingStreet = faker.address.streetAddress()
    const registerBillingZipCode = faker.address.zipCode()
    const registerBillingCity = faker.address.city()

    const registerEmailTwo = faker.internet.email()
    const registerPwTwo = faker.internet.password()
    const registerShippingFirstName = faker.name.firstName()
    const registerShippingLastName = faker.name.lastName()
    const registerShippingStreet = faker.address.streetAddress()
    const registerShippingZipCode = faker.address.zipCode()
    const registerShippingCity = faker.address.city()

    return {
        registerEmailOne,
        registerPwOne,
        registerBillingFirstName,
        registerBillingLastName,
        registerBillingStreet,
        registerBillingZipCode,
        registerBillingCity,

        registerEmailTwo,
        registerPwTwo,
        registerShippingFirstName,
        registerShippingLastName,
        registerShippingStreet,
        registerShippingZipCode,
        registerShippingCity,
    }
}



export function getExistingUserData () {
    const loginEmail = '<ENTER-EMAIL-OF-EXISTING-USER>'
    const loginPw = '<ENTER-PASSWORD-OF-EXISTING-USER>'
    const loginWrongPw = '<ENTER-A-SHORT-INVALID-PASSWORD>'

    return {
        loginEmail, loginPw, loginWrongPw
    }
}



export function getGuestData () {
    const guestEmail = faker.internet.email()
    const guestFirstName = faker.name.firstName()
    const guestLastName = faker.name.lastName()
    const guestStreet = faker.address.streetAddress()
    const guestZipCode = faker.address.zipCode()
    const guestCity = faker.address.city()

    return {
        guestEmail,
        guestFirstName,
        guestLastName,
        guestStreet,
        guestZipCode,
        guestCity
    }
}




export function register(shippingAndBillingAddressAreTheSame = true, desktop = true) {
        it('accepts Cookies', function () {
            cy.acceptCookies()
        })



        it('goes to register page & enters email & pw', function () {
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
                .type(registerEmailOne)
                .should('have.value', registerEmailOne)


            cy.get('#email-repeat')
                .type(registerEmailOne)
                .should('have.value', registerEmailOne)


            cy.get('#password')
                .type(registerPwOne)
                .should('have.value', registerPwOne)


            cy.get('#passwordRepeat')
                .type(registerPwOne)
                .should('have.value', registerPwOne)
        })



        it('enters address information', function () {
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

        })



        it.skip('checks privacy notice box & registers', function () {
            // todo: simplify selector
            cy.get('.hbl-checkbox > label')
                .eq(1)
                .click()


            cy.get('#privacyPolicy').should('be.checked')


            cy.get('button')
                .contains('Register')
                .click()
        })
}

