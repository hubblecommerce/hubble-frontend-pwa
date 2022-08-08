import { defineNuxtPlugin, useRuntimeConfig, useCookie } from '#app'
import { useCustomer, usePlatform } from '#imports'

export default defineNuxtPlugin(() => {
    const { sessionCookie } = useRuntimeConfig()
    const cookie = useCookie(sessionCookie.name)

    if (cookie.value === undefined) {
        return
    }

    const { setSessionToken, getSession } = usePlatform()
    setSessionToken(cookie.value)

    getSession()
})
