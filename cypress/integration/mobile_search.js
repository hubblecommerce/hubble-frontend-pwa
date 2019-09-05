let searchTermKnown = 'Shirt';
let searchTermUnknown = 'Quatsch';

describe('Test search on type', function() {
    it('Successfully get search results after typing', function() {
        cy.viewport('iphone-6')
        cy.visit('')
        cy.get('.search-cpt-wrp').contains('Toggle Navigation').click()
        cy.get('#search_mini_form input').type(searchTermKnown)
        cy.wait(500)
        cy.get('#livesearch-box-wrapper .container').children().should('to.have.length.to.be.at.least', 15)
    })
})

describe('Test search submission', function() {
    it('Successfully get search results after typing', function() {
        cy.viewport('iphone-6')
        cy.get('#search_mini_form button').click()
        cy.wait(500)
        cy.url().should('include', '/search/catalogsearch?term='+searchTermKnown)
        cy.get('.listing-wrp').should('not.to.be.empty')
    })
})

describe('Test search submission if no result', function() {
    it('Successfully see message on no result', function() {
        cy.viewport('iphone-6')
        cy.visit('')
        cy.get('.search-cpt-wrp').contains('Toggle Navigation').click()
        cy.get('#search_mini_form input').type(searchTermUnknown)
        cy.get('#search_mini_form button').click()
        cy.wait(500)
        cy.get('.category-header .title').contains('Keine Suchergebnisse für: '+searchTermUnknown)
    })
})

