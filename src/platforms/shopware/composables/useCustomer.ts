import { ref, Ref } from 'vue'
import { navigateTo } from '#app'
import { defineStore, storeToRefs } from 'pinia'
import { useCart, useNotification, usePlatform, useRuntimeConfig } from '#imports'
import {
    Customer,
    CustomerShippingAddress,
    CustomerBillingAddress,
    IUseCustomer,
    RegisterCustomerForm,
    Order
} from '@hubblecommerce/hubble/commons'
import {
    AddressShopware,
    LoginRegistrationShopware, NewsletterShopware,
    OrderShopware, ProfileShopware,
    SystemContextShopware
} from '@hubblecommerce/hubble/platforms/shopware/api-client'
import {
    mapCustomer,
    mapCustomerAddress,
    mapCustomerAddresses,
    mapOrder,
    mapOrders,
    reverseMapCustomerAddress
} from '@hubblecommerce/hubble/platforms/shopware/api-client/utils'

export const useCustomer = defineStore('use-customer', (): IUseCustomer => {
    const customer: Ref<Customer | null> = ref(null)
    const loading: Ref<boolean> = ref(false)
    const error: Ref = ref(false)
    const { setSessionToken, getSession } = usePlatform()
    const { platformBaseUrl } = useRuntimeConfig()
    const { showNotification } = useNotification()

    async function getCustomer (): Promise<Customer> {
        loading.value = true
        error.value = false

        try {
            /*
             * Get customer from context instead of ProfileShopware.readCustomer
             * because activeShippingAddress and activeBillingAddress is only available in /context
             * active addresses in session are mandatory for checkout contact step
             */
            const response = await SystemContextShopware.readContext()
            const mappedData = mapCustomer(response.customer)

            // Only set customer data client side to prevent leaked states on server
            customer.value = mappedData

            loading.value = false
            return mappedData
        } catch (e) {
            // Reset customer data in case of any error
            customer.value = null

            loading.value = false
            error.value = e
            throw e
        }
    }

    async function login (username: string, password: string): Promise<string> {
        loading.value = true
        error.value = false

        try {
            const platformStore = usePlatform()
            const { session } = storeToRefs(platformStore)
            const { getCart } = useCart()

            if (session?.value?.sessionToken === null) {
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
            const error = e as any

            if (error.body[0]?.detail != null) {
                showNotification(error.body[0]?.detail, 'error', true)
            } else {
                showNotification(error, 'error', true)
            }

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

    async function register (formData: RegisterCustomerForm): Promise<Customer | void> {
        loading.value = true
        error.value = false

        try {
            const shippingAddress = reverseMapCustomerAddress(formData.shippingAddress.value)
            const billingAddress = reverseMapCustomerAddress(formData.billingAddress.value)

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
        } catch (e) {
            const error = e as any

            if (error.body[0]?.detail != null) {
                showNotification(error.body[0]?.detail, 'error', true)
            } else {
                showNotification(error, 'error', true)
            }
            loading.value = false
            error.value = e
            throw e
        }
    }

    async function updateShippingAddress (shippingAddress: CustomerShippingAddress): Promise<CustomerShippingAddress | void> {
        const mappedAddress = await updateCustomerAddress(shippingAddress)

        if (error.value || customer?.value == null || mappedAddress == null) {
            return
        }

        customer.value.shippingAddress = mappedAddress

        return mappedAddress
    }

    async function updateBillingAddress (billingAddress: CustomerBillingAddress): Promise<CustomerBillingAddress | void> {
        const mappedAddress = await updateCustomerAddress(billingAddress)

        if (error.value || customer?.value == null || mappedAddress == null) {
            return
        }

        customer.value.billingAddress = mappedAddress

        return mappedAddress
    }

    async function getCustomerAddresses (): Promise<CustomerBillingAddress[] | CustomerShippingAddress[]> {
        loading.value = true
        error.value = false

        try {
            const response = await AddressShopware.listAddress()

            loading.value = false

            // Todo patch api client
            // @ts-ignore
            return mapCustomerAddresses(response.elements)
        } catch (e) {
            loading.value = false
            error.value = e
            throw e
        }
    }

    async function addCustomerAddress (address: CustomerBillingAddress | CustomerShippingAddress): Promise<CustomerBillingAddress | CustomerShippingAddress | void> {
        loading.value = true
        error.value = false

        try {
            const response = await AddressShopware.createCustomerAddress(
                'application/json',
                'application/json',
                reverseMapCustomerAddress(address)
            )

            loading.value = false
            return mapCustomerAddress(response)
        } catch (e) {
            loading.value = false
            error.value = e
        }
    }

    async function updateCustomerAddress (address: CustomerBillingAddress | CustomerShippingAddress): Promise<CustomerBillingAddress | CustomerShippingAddress | void> {
        loading.value = true
        error.value = false

        try {
            const response = await AddressShopware.updateCustomerAddress(
                address.id,
                'application/json',
                'application/json',
                reverseMapCustomerAddress(address)
            )

            const mappedAddress = mapCustomerAddress(response)

            loading.value = false
            return mappedAddress
        } catch (e) {
            loading.value = false
            error.value = e
        }
    }

    async function deleteCustomerAddress (addressId: string): Promise<void> {
        loading.value = true
        error.value = false

        try {
            await AddressShopware.deleteCustomerAddress(addressId)
            loading.value = false
            return
        } catch (e) {
            loading.value = false
            error.value = e
        }
    }

    async function getOrders (id?: string): Promise<Order | Order[]> {
        loading.value = true
        error.value = false

        let filter = null
        if (id) {
            filter = [
                {
                    type: 'equals',
                    field: 'id',
                    value: id
                }
            ]
        }

        try {
            const response = await OrderShopware.readOrder({
                associations: {
                    deliveries: {
                        associations: {
                            shippingMethod: {
                                associations: {
                                    prices: {}
                                }
                            },
                            shippingOrderAddress: {
                                associations: {
                                    salutation: {}
                                }
                            }
                        }
                    },
                    transactions: {
                        associations: {
                            paymentMethod: {}
                        }
                    },
                    lineItems: {
                        associations: {
                            cover: {}
                        }
                    },
                    billingAddress: {
                        associations: {
                            salutation: {}
                        }
                    }
                },
                ...(filter != null && { filter })
            })

            let mappedData = null

            if (id) {
                mappedData = mapOrder(response.orders.elements[0])
            } else {
                mappedData = mapOrders(response.orders.elements)
            }

            loading.value = false
            return mappedData
        } catch (e) {
            loading.value = false
            error.value = e
            throw new Error(e as string)
        }
    }

    async function setDefaultBilling (id: string): Promise<void> {
        loading.value = true
        error.value = false

        try {
            await AddressShopware.defaultBillingAddress(id)
            loading.value = false
            return
        } catch (e) {
            loading.value = false
            error.value = e
        }
    }

    async function setDefaultShipping (id: string): Promise<void> {
        loading.value = true
        error.value = false

        try {
            await AddressShopware.defaultShippingAddress(id)
            loading.value = false
            return
        } catch (e) {
            loading.value = false
            error.value = e
        }
    }

    async function requireNewPassword (email: string): Promise<void> {
        loading.value = true
        error.value = false

        try {
            await ProfileShopware.sendRecoveryMail({
                email,
                storefrontUrl: platformBaseUrl
            })

            loading.value = false
            return
        } catch (e) {
            loading.value = false
            error.value = e
            throw e
        }
    }

    async function setNewPassword (hash: string, password: string, passwordRepeat: string): Promise<void> {
        loading.value = true
        error.value = false

        try {
            await ProfileShopware.recoveryPassword({
                hash,
                newPassword: password,
                newPasswordConfirm: passwordRepeat
            })

            loading.value = false
            return
        } catch (e) {
            loading.value = false
            error.value = e
            throw e
        }
    }

    async function editCustomerInfo (formData: { dateOfBirth: string, salutationId: string, firstName: string, lastName: string }): Promise<void> {
        loading.value = true
        error.value = false

        try {
            let dateOfBirth = null
            if (formData.dateOfBirth != null) {
                dateOfBirth = new Date(formData.dateOfBirth)
            }

            await ProfileShopware.changeProfile({
                salutationId: formData.salutationId,
                firstName: formData.firstName,
                lastName: formData.lastName,
                ...(dateOfBirth != null && {
                    birthdayDay: dateOfBirth.getDate(),
                    birthdayMonth: dateOfBirth.getMonth() + 1,
                    birthdayYear: dateOfBirth.getFullYear(),
                })
            })

            loading.value = false
            return
        } catch (e) {
            loading.value = false
            error.value = e
            throw e
        }
    }

    async function editCustomerEmail (formData: { email: string, emailConfirmation: string, password: string }): Promise<void> {
        loading.value = true
        error.value = false

        try {
            await ProfileShopware.changeEmail(formData)

            loading.value = false
            return
        } catch (e) {
            loading.value = false
            error.value = e
            throw e
        }
    }

    async function editCustomerPassword (formData: { password: string, newPassword: string, newPasswordConfirm: string }): Promise<void> {
        loading.value = true
        error.value = false

        try {
            await ProfileShopware.changePassword(formData)

            loading.value = false
            return
        } catch (e) {
            loading.value = false
            error.value = e
            throw e
        }
    }

    async function editCustomerNewsletter (formData: { email: string, option: string, storefrontUrl: string }): Promise<void> {
        loading.value = true
        error.value = false

        if (formData.option === 'direct') {
            try {
                await NewsletterShopware.subscribeToNewsletter(formData)

                loading.value = false
                return
            } catch (e) {
                loading.value = false
                error.value = e
                throw e
            }
        }

        if (formData.option === 'unsubscribe') {
            try {
                await NewsletterShopware.unsubscribeToNewsletter({ email: formData.email })

                loading.value = false
                return
            } catch (e) {
                loading.value = false
                error.value = e
                throw e
            }
        }
    }

    return {
        customer,
        loading,
        error,
        getCustomer,
        login,
        logout,
        register,
        updateShippingAddress,
        updateBillingAddress,
        getCustomerAddresses,
        addCustomerAddress,
        updateCustomerAddress,
        deleteCustomerAddress,
        getOrders,
        setDefaultBilling,
        setDefaultShipping,
        requireNewPassword,
        setNewPassword,
        editCustomerInfo,
        editCustomerEmail,
        editCustomerPassword,
        editCustomerNewsletter
    }
})
