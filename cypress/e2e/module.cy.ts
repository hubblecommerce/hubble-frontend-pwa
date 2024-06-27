describe('TailwindCSS and DaisyUI integration', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080)
    })

    it('apply tailwind utility classes', () => {
        cy.visit('/')
        cy.get('#tailwind-utility')
            .should('have.css', 'color')
            .should('equal', 'rgb(0, 0, 0)')
    })

    it('apply daisyui utility classes', () => {
        cy.visit('/')
        cy.get('#daisyui-utility')
            .should('have.css', 'border-radius')
            .should('not.eq', '0px')
    })

    it('is possible to override daisyui utilities with default tailwind utilities', () => {
        cy.visit('/')
        cy.get('#overridden-daisyui-utility')
            .should('have.css', 'color')
            .should('equal', 'rgb(0, 0, 0)')
    })

    it('is possible to override ~/error.vue to create a custom error page', () => {
        cy.request({ url: '/this-route-not-exists', failOnStatusCode: false }).its('status').should('equal', 404)
        cy.visit('/this-route-not-exists', { failOnStatusCode: false })
        cy.get('html').contains('Override Custom Error Page')
    })
})
