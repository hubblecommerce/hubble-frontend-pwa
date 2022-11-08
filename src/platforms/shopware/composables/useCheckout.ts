import { ref, Ref } from 'vue'
import { LocationQuery } from 'vue-router'
import { navigateTo, useRuntimeConfig } from '#app'
import { defineStore, storeToRefs } from 'pinia'
import { IUseCheckout, PaymentMethod, ShippingMethod } from '@hubblecommerce/hubble/commons'
import {
    OrderShopware,
    PaymentMethodShopware,
    PaymentShippingShopware,
    SystemContextShopware
} from '@hubblecommerce/hubble/platforms/shopware/api-client'
import {
    mapPaymentMethods,
    mapShippingMethods
} from '@hubblecommerce/hubble/platforms/shopware/api-client/utils'
import { useNotification, useCart, useRouter } from '#imports'

export const useCheckoutStore = defineStore('use-checkout', () => {
    const shippingError: Ref = ref(false)
    const paymentError: Ref = ref(false)
    const orderComment: Ref<string> = ref('')

    return {
        shippingError,
        paymentError,
        orderComment
    }
})

export const useCheckout = function (): IUseCheckout {
    const error: Ref = ref(false)
    const loading: Ref<boolean> = ref(false)
    const shippingMethods: Ref<null | ShippingMethod[]> = ref(null)
    const paymentMethods: Ref<null | PaymentMethod[]> = ref(null)
    const { deleteCart } = useCart()
    const { showNotification } = useNotification()
    const { currentRoute } = useRouter()
    const config = useRuntimeConfig()

    const checkoutStore = useCheckoutStore()
    const { shippingError, paymentError, orderComment } = storeToRefs(checkoutStore)

    async function getShippingMethods (): Promise<ShippingMethod[] | void> {
        loading.value = true
        error.value = false
        shippingError.value = false

        try {
            const response = await PaymentShippingShopware.readShippingMethod(
                true,
                'application/json',
                'application/json',
                {
                    associations: {
                        prices: {}
                    }
                }
            )

            if (typeof response?.elements === 'undefined') {
                return
            }

            const mappedData = mapShippingMethods(response?.elements)

            mappedData.sort((a, b) => {
                return a.position - b.position
            })

            shippingMethods.value = mappedData

            loading.value = false
            return mappedData
        } catch (e) {
            loading.value = false
            error.value = e
            shippingError.value = e
        }
    }

    async function setShippingMethod (id: string): Promise<void> {
        loading.value = true
        error.value = false
        shippingError.value = false

        try {
            await SystemContextShopware.updateContext(
                {
                    shippingMethodId: id
                }
            )

            loading.value = false
        } catch (e) {
            loading.value = false
            error.value = e
            shippingError.value = e
        }
    }

    async function getPaymentMethods (): Promise<PaymentMethod[] | void> {
        loading.value = true
        error.value = false
        paymentError.value = false

        try {
            const response = await PaymentMethodShopware.readPaymentMethod(
                {
                    onlyAvailable: true
                }
            )

            if (typeof response?.elements === 'undefined') {
                return
            }

            const mappedData = mapPaymentMethods(response?.elements)

            mappedData.sort((a, b) => {
                return a.position - b.position
            })

            paymentMethods.value = mappedData

            loading.value = false
            return mappedData
        } catch (e) {
            loading.value = false
            error.value = e
            paymentError.value = e
        }
    }

    async function setPaymentMethod (id: string): Promise<void> {
        loading.value = true
        error.value = false
        paymentError.value = false

        try {
            await SystemContextShopware.updateContext(
                {
                    paymentMethodId: id
                }
            )

            loading.value = false
        } catch (e) {
            loading.value = false
            error.value = e
            paymentError.value = e
        }
    }

    function validateCheckout (): boolean {
        if (shippingError.value) {
            showNotification('Something is wrong with your shipping, select a different shipping method and try again.', 'error', true)
            return false
        }

        if (paymentError.value) {
            showNotification('Something is wrong with your payment, select a different payment method and try again.', 'error', true)
            return false
        }

        return true
    }

    async function placeOrder (): Promise<boolean | string> {
        loading.value = true
        error.value = false

        try {
            const response = await OrderShopware.createOrder(
                'application/json',
                'application/json',
                {
                    customerComment: orderComment.value
                }
            )

            if (typeof response?.id === 'undefined') {
                return false
            }

            await deleteCart()

            loading.value = false
            return response.id
        } catch (e) {
            loading.value = false
            error.value = true
            return false
        }
    }

    async function handlePayment (orderId: string, dataBag?: LocationQuery): Promise<void> {
        loading.value = true
        error.value = false

        if (dataBag === null) {
            dataBag = currentRoute.value.query
        }

        try {
            const response = await PaymentShippingShopware.handlePaymentMethod(
                {
                    orderId,
                    finishUrl: `${config.public.swPaymentFinishUrl}?orderId=${orderId}`,
                    errorUrl: `${config.public.swPaymentErrorUrl}?orderId=${orderId}`,
                    // TODO: patch api client
                    // @ts-ignore
                    ...(dataBag != null && { ...dataBag })
                }
            )

            if (response.redirectUrl !== null) {
                loading.value = false
                window.open(response.redirectUrl, '_self')
            } else {
                loading.value = false
                navigateTo(
                    {
                        name: 'checkout-success',
                        query: {
                            orderId
                        }
                    }
                )
            }
        } catch (e) {
            // eslint-disable-next-line no-console
            console.log(e)
            loading.value = false
            error.value = e

            // Redirect to error page
            navigateTo(
                {
                    name: 'checkout-error',
                    query: {
                        orderId
                    }
                }
            )
        }
    }

    async function resetPayment (orderId: string, paymentMethodId: string): Promise<boolean | void> {
        loading.value = true
        error.value = false

        try {
            const response = await OrderShopware.orderSetPayment(
                {
                    paymentMethodId,
                    orderId
                },
                'application/json',
                'application/json'
            )

            loading.value = false

            if (!response.success) {
                error.value = true
                return false
            }

            return response.success
        } catch (e) {
            loading.value = false
            error.value = e
        }
    }

    return {
        error,
        loading,
        shippingMethods,
        getShippingMethods,
        setShippingMethod,
        shippingError,
        paymentMethods,
        getPaymentMethods,
        setPaymentMethod,
        paymentError,
        placeOrder,
        validateCheckout,
        orderComment,
        handlePayment,
        resetPayment
    }
}
