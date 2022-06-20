import { IUsePlatform } from '@hubblecommerce/hubble/commons'
import { useRuntimeConfig } from '#imports'
import { storeToRefs } from 'pinia'
import { useSessionStore } from '../../../src/store/useSessionStore'

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
