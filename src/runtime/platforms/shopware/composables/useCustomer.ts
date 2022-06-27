import { Ref, ref, computed } from 'vue'
import { usePlatform } from '#imports'
import { Customer, IUseCustomer } from '../../../commons'
import { ProfileShopware, Customer as SwCustomer, LoginRegistrationShopware } from '../api-client/generated'

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

    async function getCustomer (): Promise<Customer> {
        loading.value = true
        error.value = false

        try {
            const response = await ProfileShopware.readCustomer()
            const mappedCustomer = mapCustomer(response)
            customer.value = mappedCustomer

            loading.value = false
            return mappedCustomer
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
            const response = await LoginRegistrationShopware.loginCustomer({ username, password })
            loading.value = false

            if (response.contextToken !== undefined) {
                setSessionToken(response.contextToken)
                return response.contextToken
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
