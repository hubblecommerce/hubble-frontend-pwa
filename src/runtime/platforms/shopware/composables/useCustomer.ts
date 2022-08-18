import { computed, ref, Ref } from 'vue'
import { FetchResult, navigateTo } from '#app'
import { FetchRequest } from 'ohmyfetch'
import { useCart, useNotification, usePlatform, useRuntimeConfig } from '#imports'
import { Customer, CustomerShippingAddress, IUseCustomer, RegisterCustomerForm } from '@hubblecommerce/hubble/commons'
import {
    AddressShopware, CustomerAddress,
    LoginRegistrationShopware,
    ProfileShopware, SystemContextShopware
} from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { mapCustomer, mapCustomerAddress } from '@hubblecommerce/hubble/platforms/shopware/api-client/utils'

const customer: Ref<Customer> = ref(null)

export const useCustomer = function (): IUseCustomer {
    const loading: Ref<boolean> = ref(false)
    const error: Ref<boolean> = ref(false)
    const { setSessionToken, getSession } = usePlatform()
    const { platformBaseUrl } = useRuntimeConfig()
    const { showNotification } = useNotification()

    const isGuest = computed(() => {
        if (customer.value?.isGuest !== undefined) {
            return customer.value.isGuest
        }
        return true
    })

    async function getCustomer (): Promise<FetchResult<FetchRequest>> {
        loading.value = true
        error.value = false

        try {
            /*
             * Get customer from context instead of ProfileShopware.readCustomer
             * because activeShippingAddress and activeBillingAddress is only available in /context
             * active addresses in session are mandatory for checkout contact step
             */
            const response = await SystemContextShopware.readContext()

            if (response.customer !== null) {
                const { customer } = useCustomer()
                customer.value = mapCustomer(response.customer)
            }

            loading.value = false
            return customer.value
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

            const response = await LoginRegistrationShopware.loginCustomer({ username, password })
            loading.value = false

            if (response.contextToken !== undefined) {
                await setSessionToken(response.contextToken)
                await getSession()
                return response.contextToken
            }

            throw new Error('Something went wrong please try again')
        } catch (e) {
            loading.value = false
            error.value = e
            throw e
        }
    }

    async function logout (): Promise<void> {
        customer.value = null
        await setSessionToken(null)

        const { getCart } = useCart()
        await getCart()

        navigateTo('/customer/login')
    }

    async function register (formData: RegisterCustomerForm): Promise<Customer> {
        loading.value = true
        error.value = false

        try {
            const shippingAddress = {
                salutationId: formData.shippingAddress.value.salutation,
                firstName: formData.shippingAddress.value.firstName,
                lastName: formData.shippingAddress.value.lastName,
                street: formData.shippingAddress.value.street,
                zipcode: formData.shippingAddress.value.zipcode,
                city: formData.shippingAddress.value.city,
                countryId: formData.shippingAddress.value.country,
                ...(formData.shippingAddress.value.company != null && { company: formData.shippingAddress.value.company }),
                ...(formData.shippingAddress.value.phone != null && { phone: formData.shippingAddress.value.phone })
            }

            const billingAddress = {
                salutationId: formData.billingAddress.value.salutation,
                firstName: formData.billingAddress.value.firstName,
                lastName: formData.billingAddress.value.lastName,
                street: formData.billingAddress.value.street,
                zipcode: formData.billingAddress.value.zipcode,
                city: formData.billingAddress.value.city,
                countryId: formData.billingAddress.value.country,
                ...(formData.billingAddress.value.company != null && { company: formData.billingAddress.value.company }),
                ...(formData.billingAddress.value.phone != null && { phone: formData.billingAddress.value.phone })
            }

            const requestBody = {
                email: formData.email,
                password: formData.password,
                salutationId: formData.shippingAddress.value.salutation,
                firstName: formData.shippingAddress.value.firstName,
                lastName: formData.shippingAddress.value.lastName,
                acceptedDataProtection: true,
                storefrontUrl: platformBaseUrl,
                shippingAddress,
                billingAddress,
                guest: !formData.createAccount
            }

            if (formData.billingSameAsShipping) {
                Object.assign(requestBody, {
                    billingAddress: shippingAddress
                })
            }

            // TODO: patch api client
            // @ts-ignore
            await LoginRegistrationShopware.register(requestBody)

            // Refresh session data
            await getSession()

            loading.value = false
            return customer.value
        } catch (e) {
            showNotification(e, 'error', true)
            loading.value = false
            error.value = e
            throw e
        }
    }

    async function updateShippingAddress (shippingAddress: CustomerShippingAddress): Promise<CustomerAddress> {
        loading.value = true
        error.value = false

        try {
            const response = await AddressShopware.updateCustomerAddress(
                shippingAddress.id,
                'application/json',
                'application/json',
                // Todo: Patch api client
                // @ts-ignore
                {
                    salutationId: shippingAddress.salutation,
                    firstName: shippingAddress.firstName,
                    lastName: shippingAddress.lastName,
                    ...(shippingAddress.company != null && { company: shippingAddress.company }),
                    street: shippingAddress.street,
                    zipcode: shippingAddress.zipcode,
                    city: shippingAddress.city,
                    countryId: shippingAddress.country,
                    ...(shippingAddress.phone != null && { phoneNumber: shippingAddress.phone })
                }
            )

            customer.value.shippingAddress = mapCustomerAddress(response)

            loading.value = false
            return response
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
        logout,
        register,
        updateShippingAddress,
        loading,
        error
    }
}
