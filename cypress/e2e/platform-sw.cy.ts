import { customFaker } from '../support/commands'

describe('Platform: Shopware', () => {
    // Generate credentials to use in further customer related tests
    const email = customFaker.internet.exampleEmail()
    const pw = customFaker.internet.password()

    beforeEach(() => {
        cy.viewport(1920, 1080)
    })

    it('limits a listing', () => {
        cy.visit('/')
        cy.waitForHydration()
        cy.selectFirstCategory()
        cy.get('body').click()

        cy.get('.join').contains('Show').next().select(0)

        cy.url().should('include', 'limit=1')
        cy.get('.grid .card').should('have.length', 1)
    })

    it('filters products', () => {
        cy.intercept({
            method: 'POST',
            url: '/store-api/product-listing/**'
        }).as('apiProductList')

        cy.visit('/')
        cy.waitForHydration()
        cy.selectFirstCategory()
        cy.get('body').click()

        cy.get('.dropdown .btn').contains('Manufacturer').click().parent().next().find('li:first').click().then(($el) => {
            const id = $el.find('input').attr('id')
            cy.wait('@apiProductList')
            cy.url().should('include', id)
        })
        cy.get('.dropdown .btn').contains('Manufacturer').prev().click()
        cy.contains('Reset all filter').click().should('not.exist')
    })

    it('searches for product', () => {
        cy.visit('/')
        cy.waitForHydration()

        // click search button in customer navigation
        cy.get('.navbar-end > div:nth-child(3)').click()
        cy.get('.drawer-side .form-control input').type('product')
        cy.get('.drawer-side .grid.grid-cols-2.gap-2').children().should('have.length.at.least', 1)

        cy.contains('View all results').click()
        cy.url().should('include', 'search=product')
        cy.get('.search-page .grid .card').should('have.length.at.least', 1)
    })

    it('adds product to cart', () => {
        cy.visit('/')
        cy.selectRandomProduct()
        cy.addToCart()

        // cart off-canvas menu
        cy.get('.navbar-end .btn:last').click()
        cy.wait(500)
        cy.get('.drawer-side .avatar').should('have.lengthOf', 1)

        // cart page
        cy.visit('/cart')
        cy.get('.drawer-content .avatar').should('have.lengthOf', 1)
    })

    it('removes product from cart', () => {
        cy.intercept({
            method: 'POST',
            url: '/store-api/checkout/cart/line-item/delete'
        }).as('apiRemoveLineItem')

        cy.visit('/')
        cy.selectRandomProduct()
        cy.addToCart()

        // cart off-canvas menu
        cy.get('.navbar-end .btn:last').click()
        cy.wait(500)

        cy.get('.flex.flex-col.gap-6 > div > .flex.flex-col.gap-2').children().then(($element) => {
            const count = $element.length
            cy.get('.drawer-side .absolute.right-0.top-0.btn.btn-ghost.w-13.h-13').first().click()
            cy.wait('@apiRemoveLineItem').wait(1000)

            if (count > 1) {
                cy.get('.flex.flex-col.gap-6 > div > .flex.flex-col.gap-2').children().then(($element) => {
                    const newCount = $element.length
                    expect($element.length).to.equal(count - 1)
                })
            } else {
                cy.get('.flex.flex-col.gap-6 > div').contains('Your cart is empty')
            }
        })
    })

    it('places order as guest', () => {
        cy.visit('/')

        // add a product to cart
        cy.selectRandomProduct()
        cy.addToCart()

        // navigates from cart off-canvas menu to checkout
        cy.get('.navbar-end .btn:last').click()
        cy.wait(500)
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

    it('registers a new customer', () => {
        cy.intercept({
            method: 'POST',
            url: '/store-api/salutation'
        }).as('apiGetSalutations')
        cy.intercept({
            method: 'POST',
            url: '/store-api/country'
        }).as('apiGetCountries')
        cy.intercept({
            method: 'POST',
            url: '/store-api/account/register'
        }).as('apiRegisterCustomer')
        cy.intercept({
            method: 'GET',
            url: '/store-api/context'
        }).as('apiGetContext')
        cy.intercept({
            method: 'POST',
            url: '/store-api/order'
        }).as('apiGetOrders')

        cy.visit('/customer/register')
        cy.wait('@apiGetSalutations')
        cy.wait('@apiGetCountries')

        cy.get('form.customer-register-form').within(($form) => {
            cy.get('#register-email').type(email)
            cy.get('#register-password').type(pw)
            cy.get('#register-password-repeat').type(pw)
        })

        cy.fillAddressForm('form.customer-register-form')

        cy.get('.btn.btn-primary').contains('Register').click()

        cy.wait('@apiRegisterCustomer')
        cy.wait('@apiGetContext')
        cy.wait('@apiGetOrders')

        cy.url().should('include', 'customer')
        cy.url().should('not.include', 'register')
    })

    it('login customer', () => {
        cy.loginCustomer(email, pw)
        cy.url().should('include', 'customer')
        cy.url().should('not.include', 'login')
    })

    it('logout customer', () => {
        cy.loginCustomer(email, pw)

        // click on customer navigation icon
        cy.visit('/')
        cy.waitForHydration()
        cy.get('.navbar-end > div:nth-child(4) .btn.btn-ghost').click()

        // click logout button in customer navigation
        cy.get('.navbar-end > div:nth-child(4) .menu.menu-compact li:last').click()
        cy.url().should('include', 'customer/login')
    })

    it('edits customer data', () => {
        cy.loginCustomer(email, pw)

        // open customer/account via customer navigation
        cy.visit('/')
        cy.waitForHydration()
        cy.get('.navbar-end > div:nth-child(4) .btn.btn-ghost').click()
        cy.get('.navbar-end > div:nth-child(4) .menu.menu-compact li:nth-child(2)').click()

        // change account data
        cy.get('#firstName').clear().type('e2eFirstname')
        cy.get('#lastName').clear().type('e2eLastname')
        cy.contains('Save settings').click()

        cy.reload()
        cy.get('#firstName').should('have.value', 'e2eFirstname')
        cy.get('#lastName').should('have.value', 'e2eLastname')
    })

    it('user needs to be logged in to use wishlist', () => {
        cy.visit('/')
        cy.waitForHydration()

        cy.openWishlist()
        cy.get('.drawer-side').contains('Login to create your own wishlist')
    })

    it('add product to wishlist', () => {
        cy.loginCustomer(email, pw)

        cy.visit('/')
        cy.waitForHydration()

        cy.selectRandomProduct()
        cy.addToWishlist()

        // wishlist off-canvas
        cy.openWishlist()
        cy.get('.drawer-side .avatar').should('have.lengthOf', 1)
    })

    it('remove product from wishlist', () => {
        cy.intercept({
            method: 'DELETE',
            url: '/store-api/customer/wishlist/delete/**'
        }).as('removeFromWishlist')

        cy.loginCustomer(email, pw)
        cy.visit('/')
        cy.waitForHydration()

        // wishlist off-canvas
        cy.openWishlist()

        // remove item from wishlist
        cy.get('.flex.flex-col.gap-6 > div > .flex.flex-col.gap-2').children().then(($element) => {
            const count = $element.length
            cy.get('.drawer-side .absolute.right-0.top-0.btn.btn-ghost.w-13.h-13').first().click()
            cy.wait('@removeFromWishlist')

            if (count > 1) {
                cy.get('.flex.flex-col.gap-6 > div > .flex.flex-col.gap-2').children().then(($element) => {
                    const newCount = $element.length
                    expect($element.length).to.equal(count - 1)
                })
            } else {
                cy.get('.flex.flex-col.gap-6 > div').contains('Your wishlist is empty')
            }
        })

        // test removing over wishlist button
        cy.visit('/')
        cy.waitForHydration()

        // add product to wishlist
        cy.selectRandomProduct()
        cy.addToWishlist()

        // remove same product again from wishlist
        cy.get('.card-body > .btn.btn-circle').click()
        cy.wait('@removeFromWishlist')

        cy.get('.card-body > .btn.btn-circle').should('not.have.class', 'fill-current')
    })
})
