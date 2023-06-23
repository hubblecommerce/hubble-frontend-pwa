describe('TailwindCSS and DaisyUI integration', () => {
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
})
