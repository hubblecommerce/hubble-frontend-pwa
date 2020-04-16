/* eslint-disable*/

// TODO: add environment variables & update references

describe('Check Register on Desktop', function() {
    it('Register new user, billing == shipping address', function () {
        cy.visit('')

        cy.get('.cookie-notice')
            .within(() => {
                cy.get('.button-primary').click()
            })

        cy.get('.customer-account-cpt-wrp').click()

        cy.get('.content-wrp > :nth-child(1) > :nth-child(4)').click()

        cy.url().should('include', '/customer/login')

        cy.get('.checkout-register-wrp').within(() => {
            cy.get('.button-primary').click()
        })


        cy.get('#email').type('')
            .should('have.value', '')
        cy.get('#email-repeat').type('')
            .should('have.value', '')


        cy.get('#password').type('')
            .should('have.value', '')
        cy.get('#passwordRepeat').type('')
            .should('have.value', '')


        // Select one gender & continue with that value
        cy.get(':nth-child(3) > .select-text').select('Mrs.')


        cy.get('#billingFirstName').type('')
            .should('have.value', '')
        cy.get('#billingLastName').type('')
            .should('have.value', '')
        cy.get('#billingStreet').type('')
            .should('have.value', '')

        cy.get('#billingZipCode').type('')
            .should('have.value', '')

        cy.get('#billingCity').type('')
            .should('have.value', '')


        cy.get(':nth-child(8) > .select-text').select('')


        cy.get('.form-edit > :nth-child(3)').within(() => {
            cy.get('#privacyPolicy').check({force: true})
            cy.get('#privacyPolicy').should('be.checked')
        })

        cy.get('.button-primary').click().wait(800)

        cy.url().should('eq','http://localhost:3336/customer/dashboard')
    })




    it('Register new user, billing !== shipping address', function () {
        cy.visit('')

        cy.get('.cookie-notice')
            .within(() => {
                cy.get('.button-primary').click()
            })


        cy.get('.customer-account-cpt-wrp').click()

        cy.get('.content-wrp > :nth-child(1) > :nth-child(4)').click()


        cy.url().should('include', '/customer/login')
        cy.get('.checkout-register-wrp').within(() => {
            cy.get('.button-primary').click()
        })


        cy.get('#email').type('')
            .should('have.value', '')
        cy.get('#email-repeat').type('')
            .should('have.value', '')


        cy.get('#password').type('')
            .should('have.value', '')
        cy.get('#passwordRepeat').type('')
            .should('have.value', '')


        cy.get('#differentShippingAddress').click({force: true})
        cy.get('#differentShippingAddress').should('be.checked')



        // Billing Address

        // Select one gender & continue with that value
        cy.get(':nth-child(3) > .select-text').select('Mrs.')


        cy.get('#billingFirstName').type('')
            .should('have.value', '')

        cy.get('#billingLastName').type('')
            .should('have.value', '')

        cy.get('#billingStreet').type('')
            .should('have.value', '')

        cy.get('#billingZipCode').type('')
            .should('have.value', '')

        cy.get('#billingCity').type('')
            .should('have.value', '')

        cy.get(':nth-child(8) > .select-text').select('')



        // Shipping Address
        // Shipping Address (separate from Billing Address)
        cy.get(':nth-child(2) > .select-text').select('Mr.')

        cy.get('#shippingFirstName').type('')
            .should('have.value', '')

        cy.get('#shippingLastName').type('')
            .should('have.value', '')

        cy.get('#shippingStreet').type('')
            .should('have.value', '')

        cy.get('#shippingZipCode').type('')
            .should('have.value', '')

        cy.get('#shippingCity').type('')
            .should('have.value', '')

        cy.get(':nth-child(7) > .select-text').select('')



        cy.get('.form-edit > :nth-child(4)').within(() => {
            cy.get('#privacyPolicy').check({force: true})
            cy.get('#privacyPolicy').should('be.checked')
        })


        cy.get('.button-primary').click().wait(800)

        cy.url().should('eq','http://localhost:3336/customer/dashboard')
    })
})
