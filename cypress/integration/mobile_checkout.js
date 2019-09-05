describe('Check category', function() {
    it('Open successfully category by clicking teaser', function() {
        cy.viewport('iphone-6')
        cy.visit('')
        cy.get('.mobile-teaser').click()
        cy.url().should('include', '/what-is-new')
    })
})

describe('Check detail page', function() {
    it('Open successfully detail page by clicking on listing card', function() {
        cy.viewport('iphone-6')
        cy.contains('Details').click()
        cy.get('button').should('contain', 'In den Warenkorb')
    })
})

describe('Add to cart', function() {
    it('Adding successfully item to cart', function() {
        cy.viewport('iphone-6')
        cy.get('.add-to-cart').click()
        cy.contains('Artikel zum Warenkorb hinzugefügt')
    })
})

describe('Go to checkout', function() {
    it('Open minicart and go to checkout', function() {
        cy.viewport('iphone-6')
        cy.get('.minicart-cpt-wrp').click()
        cy.get('.checkout-btn').click()
    })
})

describe('Checkout', function() {
    it('Successfully buy item', function() {
        cy.viewport('iphone-6')
        cy.wait(500)
        cy.url().should('include', '/checkout/cart')
        cy.wait(500)
        cy.contains('Kostenpflichtig bestellen').click()
        cy.wait(4000)
        cy.contains('Die Bestellung wird verarbeitet, bitte haben Sie einen Moment Geduld.')
        cy.contains('Vielen Dank für Ihren Einkauf.')
        cy.get('.minicart-cpt-wrp .item-count').should('not.exist')
    })
})
