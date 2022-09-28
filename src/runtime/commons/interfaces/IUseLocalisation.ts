import { Ref } from 'vue'

export interface IUseLocalisation {
    isLocalisedRoute (path: string): false | string,
    setLocale (locale: string): void,
    entityPathInfo: Ref<string> | null,
    defaultLocale: Ref<string>
}
