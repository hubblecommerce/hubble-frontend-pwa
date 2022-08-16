import { storeToRefs } from 'pinia'
import { ref, Ref } from 'vue'
import { useCookie } from '#app'
import { useRuntimeConfig, useCustomer } from '#imports'
import { IUsePlatform, Session, Salutation, Country } from '@hubblecommerce/hubble/commons'
import { useSessionStore } from '@hubblecommerce/hubble/src/store'
import { SystemContextShopware } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import {
    mapSession,
    mapSalutations,
    mapCustomer,
    mapCountries
} from '@hubblecommerce/hubble/platforms/shopware/api-client/utils'

const session: Ref<Session> = ref({
    sessionToken: null,
    isGuest: true
})

export const usePlatform = function (): IUsePlatform {
    const error: Ref<boolean> = ref(false)
    const loading: Ref<boolean> = ref(false)

    const runtimeConfig = useRuntimeConfig()
    const apiUrl = runtimeConfig.apiBaseUrl
    const apiAuthToken = runtimeConfig.apiSwAccessKey

    const sessionStore = useSessionStore()
    const { sessionToken } = storeToRefs(sessionStore)
    const { setSessionToken } = sessionStore

    /*
    Fetch session data from platform by session cookie
    Shopware:
    Context also contains customer data
    Even guests have to register as customer, but has the customer.guest flag set to true
     */
    async function getSession () {
        loading.value = true
        error.value = false

        try {
            const { sessionCookie } = useRuntimeConfig()
            const cookie = useCookie(sessionCookie.name)

            if (cookie.value === undefined) {
                return
            }

            const { setSessionToken } = usePlatform()
            setSessionToken(cookie.value)

            const response = await SystemContextShopware.readContext()
            const mappedData = mapSession(response)
            session.value = mappedData

            if (response.customer !== null) {
                const { customer } = useCustomer()
                customer.value = mapCustomer(response.customer)
            }

            loading.value = false
            return mappedData
        } catch (e) {
            loading.value = false
            error.value = e
            return e
        }
    }

    async function getSalutations (): Promise<Salutation[]> {
        loading.value = true
        error.value = false

        try {
            const response = await SystemContextShopware.readSalutation()

            return mapSalutations(response.elements)
        } catch (e) {
            loading.value = false
            error.value = e
            return e
        }
    }

    async function getCountries (): Promise<Country[]> {
        loading.value = true
        error.value = false

        try {
            const response = await SystemContextShopware.readCountry()

            return mapCountries(response.elements)
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
        getSalutations,
        getCountries,
        error,
        loading,
        session
    }
}
