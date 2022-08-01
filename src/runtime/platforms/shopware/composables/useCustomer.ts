import { Ref, ref, computed } from 'vue'
import { FetchResult } from '#app'
import { FetchRequest } from 'ohmyfetch'
import { usePlatform } from '#imports'
import { Customer, IUseCustomer } from '@hubblecommerce/hubble/commons'
import { ProfileShopware, Customer as SwCustomer, LoginRegistrationShopware } from '@hubblecommerce/hubble/platforms/shopware/api-client'

const customer: Ref<Customer> = ref(null)

function mapCustomer (customer: SwCustomer): Customer {
    return {
        name: customer.firstName,
        email: customer.email,
        isGuest: customer.guest
    }
}

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
            const mappedCustomer = mapCustomer(data.value)
            customer.value = mappedCustomer

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

    return {
        customer,
        getCustomer,
        isGuest,
        login,
        loading,
        error
    }
}
