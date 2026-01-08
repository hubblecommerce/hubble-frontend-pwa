import { ref, type Ref } from 'vue'
import type { NavigationFailure, RouteLocationRaw, RouteLocationNormalized } from 'vue-router'
import { type NavigateToOptions } from '#app/composables/router'
import { useRoute, useNuxtApp, navigateTo } from '#imports'
import { type HblIUseLocalisation } from '../types'

const entityPathInfo = ref(null)

export const useLocalisation = function (targetRoute?: RouteLocationNormalized): HblIUseLocalisation {
    const { vueApp } = useNuxtApp()
    const route = targetRoute != null ? targetRoute : useRoute()
    const defaultLocale = ref(vueApp?.config?.globalProperties?.$i18n?.defaultLocale) as Ref<string>

    /*
     * Function to check, if a path is a possible translated route
     */
    function isLocalisedRoute (path: string): false | string {
        if (path.startsWith('/')) {
            path = path.substring(1)
        }

        const routeParts = path.split('/')

        if (routeParts.length < 1) {
            return false
        }

        const routeLocale = routeParts[0]

        if (vueApp?.config?.globalProperties?.$i18n?.availableLocales?.includes(routeLocale)) {
            return routeLocale
        }

        return false
    }

    function setLocale (locale: string): void {
        if (vueApp?.config?.globalProperties?.$i18n?.locale != null) {
            vueApp.config.globalProperties.$i18n.locale = locale
        }
    }

    function navigateToI18n (to: RouteLocationRaw, options?: NavigateToOptions): false | void | RouteLocationRaw | Promise<false | void | NavigationFailure> {
        let target = to
        const locale = isLocalisedRoute(route.path)

        if (locale) {
            if (typeof target === 'string') {
                if (!target.startsWith('/')) {
                    target = '/' + target
                }

                target = `/${locale}${target}`
            }

            if (typeof target === 'object' && 'path' in target && target.path != null) {
                if (!target.path.startsWith('/')) {
                    target.path = '/' + target.path
                }

                target.path = `/${locale}${target.path}`
            }
        }

        return navigateTo(target, options)
    }

    return {
        isLocalisedRoute,
        setLocale,
        navigateToI18n,
        entityPathInfo,
        defaultLocale
    }
}
