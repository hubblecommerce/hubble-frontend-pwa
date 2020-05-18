/* eslint-disable */

import { register, viewPortSizes, getRandomPw, getRandomEmail} from "../support/utils"


describe('Register Flow', function () {

    viewPortSizes.forEach(viewport => {

        describe(`Tests for ${viewport.viewportWidth} w x ${viewport.viewportHeight} h`, function () {
            let emailArg = ''
            const pwArg = getRandomPw()


            beforeEach(() => {
                cy.viewport(viewport.viewportWidth, viewport.viewportHeight)
            })



            describe('registers new user, billing == shipping address', function () {
                emailArg = getRandomEmail()

                register(true, viewport.desktop, emailArg, pwArg)
            })



            describe('registers new user, billing !== shipping address', function () {
                emailArg = getRandomEmail()

                register(false, viewport.desktop, emailArg, pwArg)
            })
        })

    })

})
