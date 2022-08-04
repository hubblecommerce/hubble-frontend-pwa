import { defineNuxtPlugin, useRuntimeConfig, useCookie } from '#app'
import { useCustomer, usePlatform } from '#imports'

export default defineNuxtPlugin(() => {
    const { sessionCookie } = useRuntimeConfig()
    const cookie = useCookie(sessionCookie.name)
    const { setSessionToken } = usePlatform()

    if (cookie.value === undefined) {
        return
    }

    setSessionToken(cookie.value)

    // Fetch potential customer if session cookie exists
    const { getCustomer, isGuest, customer } = useCustomer()

    // @ts-ignore
    const { refresh } = getCustomer()

    if (customer.value != null) {
        refresh()
    }
})
