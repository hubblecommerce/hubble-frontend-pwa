import { Ref } from 'vue'
import { useRuntimeConfig } from '#imports'
import { storeToRefs } from 'pinia'
import { useSessionStore } from '@hubblecommerce/hubble/runtime/src/store/useSessionStore'

interface IUsePlatform {
    apiUrl: string,
    apiAuthToken: string,
    sessionToken: Ref<string> | null
    setSessionToken(token: string): void
}

export const usePlatform = function (): IUsePlatform {
    const runtimeConfig = useRuntimeConfig()
    const apiUrl = runtimeConfig.apiBaseUrl
    const apiAuthToken = runtimeConfig.apiSwAccessKey

    const sessionStore = useSessionStore()
    const { sessionToken } = storeToRefs(sessionStore)
    const { setSessionToken } = sessionStore

    return {
        apiUrl,
        apiAuthToken,
        sessionToken,
        setSessionToken
    }
}
