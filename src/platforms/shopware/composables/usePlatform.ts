import { defineStore, storeToRefs } from 'pinia'
import { ref, Ref } from 'vue'
import { useCookie } from '#app'
import { useRuntimeConfig, useCustomer } from '#imports'
import { IUsePlatform, Session, Salutation, Country } from '@hubblecommerce/hubble/commons'
import { SystemContextShopware } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import {
    mapSession,
    mapSalutations,
    mapCustomer,
    mapCountries
} from '@hubblecommerce/hubble/platforms/shopware/api-client/utils'

export const usePlatform = defineStore('use-platform', (): IUsePlatform => {
    const session: Ref<Session> = ref({
        sessionToken: null
    })

    const salutations: Ref<Salutation[] | null> = ref(null)
    const countries: Ref<Country[] | null> = ref(null)

    const error: Ref = ref(false)
    const loading: Ref<boolean> = ref(false)

    const runtimeConfig = useRuntimeConfig()
    const apiUrl = runtimeConfig.apiBaseUrl
    const apiAuthToken = runtimeConfig.apiSwAccessKey

    const platformLanguages = runtimeConfig.public.platformLanguages

    function setSessionToken (token: string | null): void {
        session.value.sessionToken = token

        const cookie = useCookie(runtimeConfig.sessionCookie.name, runtimeConfig.sessionCookie.options)

        if (cookie.value !== token) {
            cookie.value = token
        }
    }

    /*
     * Fetch session data from platform by session cookie
     * Shopware:
     * Context also contains customer data
     * Even guests have to register as customer, but has the customer.guest flag set to true
     */
    async function getSession (): Promise<Session | void> {
        loading.value = true
        error.value = false

        try {
            const { sessionCookie } = useRuntimeConfig()
            const cookie = useCookie(sessionCookie.name)

            if (cookie.value === undefined) {
                return
            }

            setSessionToken(cookie.value)

            const response = await SystemContextShopware.readContext()
            const mappedData = mapSession(response)
            session.value = mappedData

            if (response.customer !== null) {
                const customerStore = useCustomer()
                const { customer } = storeToRefs(customerStore)
                customer.value = mapCustomer(response.customer)
            }

            loading.value = false
            return mappedData
        } catch (e) {
            loading.value = false
            error.value = e as string
        }
    }

    async function getSalutations (): Promise<Salutation[] | void> {
        loading.value = true
        error.value = false

        try {
            const response = await SystemContextShopware.readSalutation()

            if (typeof response?.elements === 'undefined') {
                return
            }

            const mappedData = mapSalutations(response.elements)
            salutations.value = mappedData

            loading.value = false
            return mappedData
        } catch (e) {
            loading.value = false
            error.value = e
        }
    }

    async function getCountries (): Promise<Country[] | void> {
        loading.value = true
        error.value = false

        try {
            const response = await SystemContextShopware.readCountry()

            if (typeof response?.elements === 'undefined') {
                return
            }

            const mappedData = mapCountries(response.elements)
            countries.value = mappedData

            loading.value = false
            return mappedData
        } catch (e) {
            loading.value = false
            error.value = e
        }
    }

    return {
        apiUrl,
        apiAuthToken,
        setSessionToken,
        getSession,
        getSalutations,
        salutations,
        getCountries,
        countries,
        error,
        loading,
        session,
        platformLanguages
    }
})
