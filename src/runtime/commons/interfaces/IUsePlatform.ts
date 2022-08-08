import { Ref } from 'vue'
import { Platform } from './Platform'

export interface IUsePlatform {
    loading: Ref<boolean>,
    error: Ref<boolean>,
    apiUrl: string,
    apiAuthToken: string,
    sessionToken: Ref<string> | null
    setSessionToken(token: string): void,
    getSession(): void,
    platform: Ref<Platform | null>
}
