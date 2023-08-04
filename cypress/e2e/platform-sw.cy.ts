describe('Platform: Shopware', () => {
    it('places order as guest', () => {
        cy.visit('/')

        // add a product to cart
        cy.selectRandomProduct()
        cy.addToCart()

        // navigates from cart off-canvas menu to checkout
        cy.get('.navbar-end .btn:last').click()
        cy.get('.drawer-side').contains('Checkout').click()

        // registers in checkout as guest on checkout contact section
        cy.fillRegisterForm()
        cy.get('.navigation').contains('Save and continue to Shipping').click()

        // selects shipping method on checkout shipping section
        cy.get('*[id^="shipping-option"]').first().click()
        cy.get('.navigation').contains('Save and continue to Payment').click()

        // selects payment method checkout payment section
        cy.get('*[id^="payment-option"]').first().click()
        cy.get('.navigation').contains('Save and continue to Summary').click()

        // accepts all terms and conditions on checkout summary section
        cy.acceptToC()

        // places the order on checkout summary page
        cy.get('.navigation').contains('Place Order').click()

        cy.url().should('include', '/checkout/success')
    })
})
