import { ref, Ref, watch } from 'vue'
import { CookieOptions, useCookie } from '#app'
import { defineStore, storeToRefs } from 'pinia'
import {
    useCart,
    useNotification,
    usePlatform,
    useRuntimeConfig,
    hblMapCustomer,
    hblMapCustomerAddress,
    hblMapCustomerAddresses,
    hblMapOrder,
    hblMapOrders,
    swMapCustomerAddress,
    useLocalisation
} from '#imports'
import {
    HblCustomer,
    HblCustomerShippingAddress,
    HblCustomerBillingAddress,
    HblIUseCustomer,
    HblRegisterCustomerForm,
    HblOrder
} from '@/utils/types'
import {
    AddressShopware, Document, DocumentShopware,
    LoginRegistrationShopware, NewsletterShopware,
    OrderShopware, ProfileShopware,
    SystemContextShopware
} from '@hubblecommerce/hubble/platforms/shopware/api-client'

export const useCustomer = defineStore('use-customer', (): HblIUseCustomer => {
    const customer: Ref<HblCustomer | null> = ref(null)
    const loading: Ref<boolean> = ref(false)
    const error: Ref = ref(false)
    const { setSessionToken, getSession } = usePlatform()
    const { platformBaseUrl } = useRuntimeConfig().public
    const { showNotification } = useNotification()
    const runtimeConfig = useRuntimeConfig()
    const { navigateToI18n } = useLocalisation()

    // Set cookie if user is logged in to differ between session isset (context-token exists) and session
    // is related to a customer
    if (process.client) {
        watch(customer, (newVal) => {
            const customerCookie = runtimeConfig.public.customerCookie as { name: string, options: CookieOptions }
            const cookie = useCookie(customerCookie.name, customerCookie.options)

            if (newVal != null) {
                if (cookie.value !== '1') {
                    cookie.value = '1'
                }
            } else {
                cookie.value = null
            }
        })
    }

    async function getCustomer (): Promise<HblCustomer> {
        loading.value = true
        error.value = false

        try {
            /*
             * Get customer from context instead of ProfileShopware.readCustomer
             * because activeShippingAddress and activeBillingAddress is only available in /context
             * active addresses in session are mandatory for checkout contact step
             */
            const response = await SystemContextShopware.readContext()
            const mappedData = hblMapCustomer(response.customer)

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
        loading.value = true
        error.value = false

        try {
            const { getCart } = useCart()
            const response = await LoginRegistrationShopware.logoutCustomer()
            loading.value = false

            if (response.contextToken !== undefined) {
                customer.value = null
                await setSessionToken(response.contextToken)
                await getSession()

                await getCart()
                await navigateToI18n('/customer/login')
                return
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

    async function register (formData: HblRegisterCustomerForm): Promise<HblCustomer | void> {
        loading.value = true
        error.value = false

        let dobObject = null
        if (formData.dateOfBirth != null && formData.dateOfBirth !== '') {
            dobObject = new Date(formData.dateOfBirth)
        }

        try {
            const shippingAddress = swMapCustomerAddress(formData.shippingAddress.value)
            const billingAddress = swMapCustomerAddress(formData.billingAddress.value)

            const requestBody = {
                ...(dobObject != null && { birthdayDay: dobObject.getDate() }),
                ...(dobObject != null && { birthdayMonth: dobObject.getMonth() + 1 }),
                ...(dobObject != null && { birthdayYear: dobObject.getFullYear() }),
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
            const response = await LoginRegistrationShopware.register(requestBody)

            if (response.doubleOptInRegistration) {
                showNotification('Please confirm your registration by clicking on the link in the email we send you.', 'success')
            }

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

    async function registerConfirm (formData: { em: string, hash: string }): Promise<void> {
        loading.value = true

        try {
            await LoginRegistrationShopware.registerConfirm(formData)
            loading.value = false
        } catch (e) {
            loading.value = false
            throw e
        }
    }

    async function updateShippingAddress (shippingAddress: HblCustomerShippingAddress): Promise<HblCustomerShippingAddress | void> {
        const mappedAddress = await updateCustomerAddress(shippingAddress)

        if (error.value || customer?.value == null || mappedAddress == null) {
            return
        }

        customer.value.shippingAddress = mappedAddress

        return mappedAddress
    }

    async function updateBillingAddress (billingAddress: HblCustomerBillingAddress): Promise<HblCustomerBillingAddress | void> {
        const mappedAddress = await updateCustomerAddress(billingAddress)

        if (error.value || customer?.value == null || mappedAddress == null) {
            return
        }

        customer.value.billingAddress = mappedAddress

        return mappedAddress
    }

    async function getCustomerAddresses (): Promise<HblCustomerBillingAddress[] | HblCustomerShippingAddress[]> {
        loading.value = true
        error.value = false

        try {
            const response = await AddressShopware.listAddress()

            loading.value = false

            // Todo patch api client
            // @ts-ignore
            return hblMapCustomerAddresses(response.elements)
        } catch (e) {
            loading.value = false
            error.value = e
            throw e
        }
    }

    async function addCustomerAddress (address: HblCustomerBillingAddress | HblCustomerShippingAddress): Promise<HblCustomerBillingAddress | HblCustomerShippingAddress | void> {
        loading.value = true
        error.value = false

        try {
            const response = await AddressShopware.createCustomerAddress(
                swMapCustomerAddress(address)
            )

            loading.value = false
            return hblMapCustomerAddress(response)
        } catch (e) {
            loading.value = false
            error.value = e
        }
    }

    async function updateCustomerAddress (address: HblCustomerBillingAddress | HblCustomerShippingAddress): Promise<HblCustomerBillingAddress | HblCustomerShippingAddress | void> {
        loading.value = true
        error.value = false

        try {
            const response = await AddressShopware.updateCustomerAddress(
                address.id,
                swMapCustomerAddress(address)
            )

            const mappedAddress = hblMapCustomerAddress(response)

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

    async function getOrders (params?: { id?: string, page?: number }): Promise<{ data: HblOrder | HblOrder[], total: number, page: number, limit: number }> {
        loading.value = true
        error.value = false

        let filter = null
        if (params?.id != null) {
            filter = [
                {
                    type: 'equals',
                    field: 'id',
                    value: params?.id
                }
            ]
        }

        try {
            const response = await OrderShopware.readOrder({
                limit: 10,
                'total-count-mode': 2,
                ...(params?.page != null && { page: params?.page }),
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
                            cover: {},
                            downloads: {
                                associations: {
                                    media: {}
                                }
                            }
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

            const mappedData = {
                limit: response.orders?.limit,
                page: response.orders?.page,
                total: response.orders?.total,
                data: params?.id != null ? hblMapOrder(response.orders?.elements[0]) : hblMapOrders(response.orders?.elements)
            }

            loading.value = false
            return mappedData
        } catch (e) {
            loading.value = false
            error.value = e
            throw new Error(e as string)
        }
    }

    async function getOrderDocumentDownload (orderId: string, downloadId: string): Promise<Document | void> {
        loading.value = true
        error.value = false

        try {
            loading.value = false
            return await DocumentShopware.download(orderId, downloadId)
        } catch (e) {
            loading.value = false
            error.value = e
        }
    }

    async function getOrderLineItemDownload (orderId: string, downloadId: string): Promise<Blob | void> {
        loading.value = true
        error.value = false

        try {
            loading.value = false
            return await OrderShopware.orderDownloadFile(orderId, downloadId)
        } catch (e) {
            loading.value = false
            error.value = e
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
                storefrontUrl: platformBaseUrl as string
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
                    birthdayYear: dateOfBirth.getFullYear()
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

    async function confirmCustomerNewsletter (formData: { em: string, hash: string }): Promise<void> {
        loading.value = true

        try {
            await NewsletterShopware.confirmNewsletter(formData)

            loading.value = false
        } catch (e) {
            loading.value = false
            throw e
        }
    }

    async function editCustomerPayment (paymentId: string): Promise<void> {
        loading.value = true
        error.value = false

        try {
            await ProfileShopware.changePaymentMethod(paymentId)

            loading.value = false
            return
        } catch (e) {
            loading.value = false
            error.value = e
            throw e
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
        registerConfirm,
        updateShippingAddress,
        updateBillingAddress,
        getCustomerAddresses,
        addCustomerAddress,
        updateCustomerAddress,
        deleteCustomerAddress,
        getOrders,
        getOrderLineItemDownload,
        getOrderDocumentDownload,
        setDefaultBilling,
        setDefaultShipping,
        requireNewPassword,
        setNewPassword,
        editCustomerInfo,
        editCustomerEmail,
        editCustomerPassword,
        editCustomerNewsletter,
        confirmCustomerNewsletter,
        editCustomerPayment
    }
})
