/* eslint-disable */

import { register, viewPortSizes } from "../support/utils"


describe('Register Flow', function () {

    viewPortSizes.forEach(viewport => {

        describe(`Tests for ${viewport.viewportWidth} w x ${viewport.viewportHeight} h`, function () {
            beforeEach(() => {
                cy.viewport(viewport.viewportWidth, viewport.viewportHeight)
            })



            context('registers new user, billing == shipping address', function () {
                register(true, viewport.desktop)
            })



            context('registers new user, billing !== shipping address', function () {
                register(false, viewport.desktop)
            })
        })

    })

})
