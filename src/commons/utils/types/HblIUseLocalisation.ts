import { Ref } from 'vue'
import { NavigationFailure, RouteLocationRaw } from 'vue-router'
import { NavigateToOptions } from '#imports/composables/router'

export interface HblIUseLocalisation {
    isLocalisedRoute (path: string): false | string,
    setLocale (locale: string): void,
    navigateToI18n (to: RouteLocationRaw, options?: NavigateToOptions): Promise<void | NavigationFailure> | RouteLocationRaw,
    entityPathInfo: Ref<string | null>,
    defaultLocale: Ref<string>
}
