import { ref, Ref } from 'vue'
import { IUseCheckout, ShippingMethod } from '@hubblecommerce/hubble/commons'
import { PaymentShippingShopware } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { mapShippingMethods } from '@hubblecommerce/hubble/platforms/shopware/api-client/utils'

export const useCheckout = function (): IUseCheckout {
    const error: Ref<boolean | string> = ref(false)
    const loading: Ref<boolean> = ref(false)
    const shippingMethods: Ref<null | ShippingMethod[]> = ref(null)

    async function getShippingMethods (): Promise<ShippingMethod[]> {
        loading.value = true
        error.value = false

        try {
            const response = await PaymentShippingShopware.readShippingMethod(
                true,
                'application/json',
                'application/json'
            )

            const mappedData = mapShippingMethods(response?.elements)
            shippingMethods.value = mappedData

            loading.value = false
            return mappedData
        } catch (e) {
            loading.value = false
            error.value = e
            return e
        }
    }

    return {
        error,
        loading,
        getShippingMethods,
        shippingMethods
    }
}
