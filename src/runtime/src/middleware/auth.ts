import { defineNuxtRouteMiddleware, NuxtApp, useNuxtApp, navigateTo } from '#app'
import { usePlatform, useCustomer } from '#imports'

function getRequestCookie (app: NuxtApp, cookieName: string): string | null {
    const cookieHeader = app.ssrContext?.event.req.headers.cookie

    let cookie = null
    const value = `; ${cookieHeader}`
    const parts = value.split(`; ${cookieName}=`)
    if (parts.length === 2) {
        cookie = parts.pop().split(';').shift()
    }

    return cookie
}

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
