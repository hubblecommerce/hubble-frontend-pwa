import { Ref } from 'vue'

export interface HblIUseLocalisation {
    isLocalisedRoute (path: string): false | string,
    setLocale (locale: string): void,
    entityPathInfo: Ref<string | null>,
    defaultLocale: Ref<string>
}
