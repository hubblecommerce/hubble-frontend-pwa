import { ref, Ref } from 'vue'
import { useNuxtApp } from '#app'
import { HblIUseLocalisation } from '@/utils/types'

const entityPathInfo = ref(null)

export const useLocalisation = function (): HblIUseLocalisation {
    const { vueApp } = useNuxtApp()

    const defaultLocale = ref(vueApp.config.globalProperties.$i18n?.fallbackLocale) as Ref<string>

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

        if (vueApp.config.globalProperties.$i18n?.availableLocales.includes(routeLocale)) {
            return routeLocale
        }

        return false
    }

    function setLocale (locale: string): void {
        vueApp.config.globalProperties.$i18n.locale = locale
    }

    return {
        isLocalisedRoute,
        setLocale,
        entityPathInfo,
        defaultLocale
    }
}
