/* eslint-disable */

import { viewPortSizes } from "./utils"


describe('Register Flow', function () {

    viewPortSizes.forEach(viewport => {

        describe(`Tests for ${viewport.viewportWidth} w x ${viewport.viewportHeight} h`, function () {
            beforeEach(() => {
                cy.viewport(viewport.viewportWidth, viewport.viewportHeight)
            })



            it('registers new user, billing == shipping address', function () {
                cy.log(viewport.desktop)
                cy.register(true, viewport.desktop)
            })



            it('registers new user, billing !== shipping address', function () {
                cy.register(false, viewport.desktop)
            })
        })
    })

})
