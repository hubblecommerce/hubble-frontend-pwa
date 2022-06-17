import { defineNuxtPlugin, useRuntimeConfig, useCookie } from '#app'
import { usePlatform } from '#imports'

export default defineNuxtPlugin(() => {
    const { sessionCookie } = useRuntimeConfig()
    const cookie = useCookie(sessionCookie.name)
    const { setSessionToken } = usePlatform()

    if (cookie.value !== undefined) {
        setSessionToken(cookie.value)
    }
})
