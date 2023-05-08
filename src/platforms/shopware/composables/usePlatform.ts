import { defineStore, storeToRefs } from 'pinia'
import { ref, Ref } from 'vue'
import { useCookie } from '#app'
import {
    useRuntimeConfig,
    useCustomer,
    hblMapSession,
    hblMapSalutations,
    hblMapCustomer,
    hblMapCountries
} from '#imports'
import { HblIUsePlatform, HblSession, HblSalutation, HblCountry } from '@/utils/types'
import { SystemContextShopware } from '@hubblecommerce/hubble/platforms/shopware/api-client'

export const usePlatform = defineStore('use-platform', (): HblIUsePlatform => {
    const session: Ref<HblSession> = ref({
        sessionToken: null
    })

    const salutations: Ref<HblSalutation[] | null> = ref(null)
    const countries: Ref<HblCountry[] | null> = ref(null)

    const error: Ref = ref(false)
    const loading: Ref<boolean> = ref(false)

    const runtimeConfig = useRuntimeConfig()
    const apiUrl = runtimeConfig.public.apiBaseUrl
    const apiAuthToken = runtimeConfig.public.apiSwAccessKey

    const platformLanguages = runtimeConfig.public.platformLanguages

    function setSessionToken (token: string | null): void {
        session.value.sessionToken = token

        const cookie = useCookie(runtimeConfig.public.sessionCookie.name, runtimeConfig.public.sessionCookie.options)

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
    async function getSession (): Promise<HblSession | void> {
        loading.value = true
        error.value = false

        try {
            const { sessionCookie } = useRuntimeConfig().public
            const cookie = useCookie(sessionCookie.name)

            if (cookie.value === undefined) {
                return
            }

            setSessionToken(cookie.value)

            const response = await SystemContextShopware.readContext()
            const mappedData = hblMapSession(response)
            session.value = mappedData

            if (response.customer !== null) {
                const customerStore = useCustomer()
                const { customer } = storeToRefs(customerStore)
                customer.value = hblMapCustomer(response.customer)
            }

            loading.value = false
            return mappedData
        } catch (e) {
            loading.value = false
            error.value = e as string
        }
    }

    async function getSalutations (): Promise<HblSalutation[] | void> {
        loading.value = true
        error.value = false

        try {
            const response = await SystemContextShopware.readSalutation()

            if (typeof response?.elements === 'undefined') {
                return
            }

            const mappedData = hblMapSalutations(response.elements)
            salutations.value = mappedData

            loading.value = false
            return mappedData
        } catch (e) {
            loading.value = false
            error.value = e
        }
    }

    async function getCountries (): Promise<HblCountry[] | void> {
        loading.value = true
        error.value = false

        try {
            const response = await SystemContextShopware.readCountry()

            if (typeof response?.elements === 'undefined') {
                return
            }

            const mappedData = hblMapCountries(response.elements)
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
