import { defineNuxtRouteMiddleware, navigateTo, useRuntimeConfig } from '#app'
import { useLocalisation } from '#imports'

export default defineNuxtRouteMiddleware((to) => {
    const config = useRuntimeConfig()

    const { isLocalisedRoute, setLocale, defaultLocale } = useLocalisation(to)
    const routeLocale = isLocalisedRoute(to.path)

    if (routeLocale) {
        if (config.public.redirectDefaultLanguage && routeLocale === defaultLocale.value) {
            return navigateTo(to.fullPath.replace(`/${routeLocale}`, ''), { redirectCode: 302 })
        }

        setLocale(routeLocale)
    } else {
        setLocale(defaultLocale.value)
    }
})
