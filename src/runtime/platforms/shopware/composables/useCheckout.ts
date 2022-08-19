import { ref, Ref } from 'vue'
import { IUseCheckout, PaymentMethod, ShippingMethod } from '@hubblecommerce/hubble/commons'
import {
    PaymentMethodShopware,
    PaymentShippingShopware,
    SystemContextShopware
} from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { mapPaymentMethods, mapShippingMethods } from '@hubblecommerce/hubble/platforms/shopware/api-client/utils'

export const useCheckout = function (): IUseCheckout {
    const error: Ref<boolean | string> = ref(false)
    const loading: Ref<boolean> = ref(false)
    const shippingMethods: Ref<null | ShippingMethod[]> = ref(null)
    const paymentMethods: Ref<null | PaymentMethod[]> = ref(null)

    async function getShippingMethods (): Promise<ShippingMethod[]> {
        loading.value = true
        error.value = false

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
            return e
        }
    }

    async function setShippingMethod (id: string): Promise<void> {
        loading.value = true
        error.value = false

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
            return e
        }
    }

    async function getPaymentMethods (): Promise<PaymentMethod[]> {
        loading.value = true
        error.value = false

        try {
            const response = await PaymentMethodShopware.readPaymentMethod(
                {
                    onlyAvailable: true
                }
            )

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
            return e
        }
    }

    async function setPaymentMethod (id: string): Promise<void> {
        loading.value = true
        error.value = false

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
            return e
        }
    }

    return {
        error,
        loading,
        shippingMethods,
        getShippingMethods,
        setShippingMethod,
        paymentMethods,
        getPaymentMethods,
        setPaymentMethod
    }
}
