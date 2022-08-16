import { defineNuxtRouteMiddleware, useNuxtApp, navigateTo } from '#app'
import { usePlatform, useCustomer } from '#imports'
import { getRequestCookie } from '@hubblecommerce/hubble/commons'

export default defineNuxtRouteMiddleware(async () => {
    const app = useNuxtApp()
    const { sessionToken, setSessionToken } = usePlatform()

    if (process.server) {
        const sessionCookie = getRequestCookie(app, app.$config.public.sessionCookie.name)
        setSessionToken(sessionCookie)
    }

    if (sessionToken.value === null) {
        return navigateTo('/customer/login')
    }

    const { getCustomer, isGuest } = useCustomer()

    try {
        await getCustomer()

        if (isGuest.value) {
            throw new Error('Guests are not authorized')
        }
    } catch (e) {
        return navigateTo('/customer/login')
    }

    return true
})
