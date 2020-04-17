/* eslint-disable*/

const registerEmailOne = Cypress.env('register-email-one')
const registerPwOne = Cypress.env('register-pw-one')
const registerBillingFirstName = Cypress.env('register-billing-first-name')
const registerBillingLastName = Cypress.env('register-billing-last-name')
const registerBillingStreet = Cypress.env('register-billing-street')
const registerBillingZipCode = Cypress.env('register-billing-zip-code')
const registerBillingCity = Cypress.env('register-billing-city')
const registerBillingCountry = Cypress.env('register-billing-country')

const registerEmailTwo = Cypress.env('register-email-two')
const registerPwTwo = Cypress.env('register-pw-two')
const registerShippingFirstName = Cypress.env('register-shipping-first-name')
const registerShippingLastName = Cypress.env('register-shipping-last-name')
const registerShippingStreet = Cypress.env('register-shipping-street')
const registerShippingZipCode = Cypress.env('register-shipping-zip-code')
const registerShippingCity = Cypress.env('register-shipping-city')
const registerShippingCountry = Cypress.env('register-shipping-country')



describe('Check Mobile Register', function() {
    it('Register new user, billing == shipping address', function () {
        cy.visit('')

        cy.get('.cookie-notice')
            .within(() => {
                cy.get('.button-primary').click()
            })

        cy.get('.customer-account-cpt-wrp').click()

        cy.get('.container > .content-wrp > :nth-child(1) > :nth-child(4)').click()

        cy.url().should('include', '/customer/login')

        cy.get(':nth-child(2) > .tabs-component-tab-a').click()

        cy.get('#email').type(registerEmailOne)
            .should('have.value', registerEmailOne)

        cy.get('#email-repeat').type(registerEmailOne)
            .should('have.value', registerEmailOne)


        cy.get('#password').type(registerPwOne)
            .should('have.value', registerPwOne)

        cy.get('#passwordRepeat').type(registerPwOne)
            .should('have.value', registerPwOne)


        // Select one gender & continue with that value
        cy.get(':nth-child(3) > .select-text').select('Mrs.')


        cy.get('#billingFirstName').type(registerBillingFirstName)
            .should('have.value', registerBillingFirstName)
        cy.get('#billingLastName').type(registerBillingLastName)
            .should('have.value', registerBillingLastName)
        cy.get('#billingStreet').type(registerBillingStreet)
            .should('have.value', registerBillingStreet)

        cy.get('#billingZipCode').type(registerBillingZipCode)
            .should('have.value', registerBillingZipCode)

        cy.get('#billingCity').type(registerBillingCity)
            .should('have.value', registerBillingCity)


        cy.get(':nth-child(8) > .select-text').select(registerBillingCountry)

        cy.get('#privacyPolicy').check({force: true})

        cy.get('.form-edit > .button-primary').click()
    })



    it('Register new user, billing !== shipping address', function () {
        cy.visit('')

        cy.get('.cookie-notice')
            .within(() => {
                cy.get('.button-primary').click()
            })

        cy.get('.customer-account-cpt-wrp').click()

        cy.get('.container > .content-wrp > :nth-child(1) > :nth-child(4)').click()

        cy.url().should('include', '/customer/login')

        cy.get(':nth-child(2) > .tabs-component-tab-a').click()



        cy.get('#email').type(registerEmailTwo)
            .should('have.value', registerEmailTwo)
        cy.get('#email-repeat').type(registerEmailTwo)
            .should('have.value', registerEmailTwo)


        cy.get('#password').type(registerPwTwo)
            .should('have.value', registerPwTwo)
        cy.get('#passwordRepeat').type(registerPwTwo)
            .should('have.value', registerPwTwo)

        cy.get('.different-shipping-address > .hbl-checkbox').click()



        // Billing Address

        // Select one gender & continue with that value
        cy.get(':nth-child(3) > .select-text').select('Mrs.')


        cy.get('#billingFirstName').type(registerBillingFirstName)
            .should('have.value', registerBillingFirstName)
        cy.get('#billingLastName').type(registerBillingLastName)
            .should('have.value', registerBillingLastName)
        cy.get('#billingStreet').type(registerBillingStreet)
            .should('have.value', registerBillingStreet)

        cy.get('#billingZipCode').type(registerBillingZipCode)
            .should('have.value', registerBillingZipCode)

        cy.get('#billingCity').type(registerBillingCity)
            .should('have.value', registerBillingCity)

        cy.get(':nth-child(8) > .select-text').select(registerBillingCountry)



        // Shipping Address (separate from Billing Address)
        cy.get(':nth-child(2) > .select-text').select('Mrs.')
        cy.get('#shippingFirstName').type(registerShippingFirstName)
            .should('have.value', registerShippingFirstName)

        cy.get('#shippingLastName').type(registerShippingLastName)
            .should('have.value', registerShippingLastName)

        cy.get('#shippingStreet').type(registerShippingStreet)
            .should('have.value', registerShippingStreet)

        cy.get('#shippingZipCode').type(registerShippingZipCode)
            .should('have.value', registerShippingZipCode)

        cy.get('#shippingCity').type(registerShippingCity)
            .should('have.value', registerShippingCity)

        cy.get(':nth-child(7) > .select-text').select(registerShippingCountry)

        

        cy.get('#privacyPolicy').check({force: true})

        cy.get('.form-edit > .button-primary').click().wait(800)

        cy.url().should('include','/customer/dashboard')
    })
})
