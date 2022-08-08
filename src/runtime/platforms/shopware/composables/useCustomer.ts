import { computed, ref, Ref } from 'vue'
import { FetchResult, navigateTo } from '#app'
import { FetchRequest } from 'ohmyfetch'
import { useCart, usePlatform } from '#imports'
import { Customer, IUseCustomer } from '@hubblecommerce/hubble/commons'
import { LoginRegistrationShopware, ProfileShopware } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { mapCustomer } from '@hubblecommerce/hubble/platforms/shopware/api-client/utils'

const customer: Ref<Customer> = ref(null)

export const useCustomer = function (): IUseCustomer {
    const loading: Ref<boolean> = ref(false)
    const error: Ref<boolean> = ref(false)
    const { setSessionToken } = usePlatform()

    const isGuest = computed(() => {
        if (customer.value.isGuest !== undefined) {
            return customer.value.isGuest
        }
        return true
    })

    async function getCustomer (): Promise<FetchResult<FetchRequest>> {
        loading.value = true
        error.value = false

        try {
            // @ts-ignore
            const { data, pending, refresh } = await ProfileShopware.readCustomer()
            customer.value = mapCustomer(data.value)

            loading.value = false
            return { data, pending, refresh }
        } catch (e) {
            loading.value = false
            error.value = e
            throw e
        }
    }

    async function login (username: string, password: string): Promise<string> {
        loading.value = true
        error.value = false

        try {
            const { sessionToken } = usePlatform()
            const { getCart } = useCart()

            if (sessionToken.value === null) {
                await getCart()
            }

            // @ts-ignore
            const { data } = await LoginRegistrationShopware.loginCustomer({ username, password })
            loading.value = false

            if (data.value.contextToken !== undefined) {
                setSessionToken(data.value.contextToken)
                return data.value.contextToken
            }

            throw new Error('Something went wrong please try again')
        } catch (e) {
            loading.value = false
            error.value = e
            throw e
        }
    }

    function logout (): void {
        customer.value = null
        setSessionToken(null)
        navigateTo('/customer/login')
    }

    return {
        customer,
        getCustomer,
        isGuest,
        login,
        logout,
        loading,
        error
    }
}
