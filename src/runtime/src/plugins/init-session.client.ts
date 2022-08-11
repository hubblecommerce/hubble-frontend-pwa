import { defineNuxtPlugin, useRuntimeConfig, useCookie } from '#app'
import { usePlatform } from '#imports'

export default defineNuxtPlugin(async () => {
    const { sessionCookie } = useRuntimeConfig()
    const cookie = useCookie(sessionCookie.name)

    if (cookie.value === undefined) {
        return
    }

    const { setSessionToken, getSession } = usePlatform()
    setSessionToken(cookie.value)

    await getSession()
})
