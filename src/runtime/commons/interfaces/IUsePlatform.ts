import { Ref } from 'vue'

export interface IUsePlatform {
    apiUrl: string,
    apiAuthToken: string,
    sessionToken: Ref<string> | null
    setSessionToken(token: string): void
}
