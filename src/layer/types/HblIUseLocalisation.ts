import { type Ref } from 'vue'
import type { NavigationFailure, RouteLocationRaw } from 'vue-router'
import type { NavigateToOptions } from '#app/composables/router'

export interface HblIUseLocalisation {
    isLocalisedRoute (path: string): false | string,
    setLocale (locale: string): void,
    navigateToI18n (to: RouteLocationRaw, options?: NavigateToOptions): false | void | RouteLocationRaw | Promise<false | void | NavigationFailure>,
    entityPathInfo: Ref<string | null>,
    defaultLocale: Ref<string>
}
