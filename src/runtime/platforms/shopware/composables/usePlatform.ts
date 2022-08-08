import { storeToRefs } from 'pinia'
import { ref, Ref } from 'vue'
import { useRuntimeConfig, useCustomer } from '#imports'
import { IUsePlatform, Platform } from '@hubblecommerce/hubble/commons'
import { useSessionStore } from '@hubblecommerce/hubble/src/store'
import { SystemContextShopware } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { mapCustomer, mapPlatform } from '@hubblecommerce/hubble/platforms/shopware/api-client/utils'

const platform: Ref<Platform> = ref(null)

export const usePlatform = function (): IUsePlatform {
    const error: Ref<boolean> = ref(false)
    const loading: Ref<boolean> = ref(false)

    const runtimeConfig = useRuntimeConfig()
    const apiUrl = runtimeConfig.apiBaseUrl
    const apiAuthToken = runtimeConfig.apiSwAccessKey

    const sessionStore = useSessionStore()
    const { sessionToken } = storeToRefs(sessionStore)
    const { setSessionToken } = sessionStore

    async function getSession () {
        loading.value = true
        error.value = false

        try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const { data, pending, error } = await SystemContextShopware.readContext()
            const mappedData = mapPlatform(data.value)
            platform.value = mappedData

            // Set customer data to avoid redundant getCustomer call on init-session.client
            if (data.value.customer != null) {
                const { customer } = useCustomer()
                customer.value = mapCustomer(data.value.customer)
            }

            loading.value = false
            return mappedData
        } catch (e) {
            loading.value = false
            error.value = e
            return e
        }
    }

    return {
        apiUrl,
        apiAuthToken,
        sessionToken,
        setSessionToken,
        getSession,
        error,
        loading,
        platform
    }
}
