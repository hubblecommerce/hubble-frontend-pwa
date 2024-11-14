import { type Ref } from 'vue'
import type { LocationQuery } from 'vue-router'
import { type HblShippingMethod } from '@/utils/types/HblShippingMethod'
import { type HblPaymentMethod } from '@/utils/types/HblPaymentMethod'

export interface HblIUseCheckout {
    loading: Ref<boolean>,
    error: Ref,
    shippingMethods: Ref<null | HblShippingMethod[]>,
    getShippingMethods(): Promise<HblShippingMethod[] | void>,
    setShippingMethod(id: string): Promise<void>,
    shippingError: Ref,
    paymentMethods: Ref<null | HblPaymentMethod[]>,
    getPaymentMethods(): Promise<HblPaymentMethod[] | void>,
    setPaymentMethod(id: string): Promise<void>,
    paymentError: Ref,
    placeOrder(): Promise<boolean | string>,
    validateCheckout(): boolean,
    orderComment: Ref<string>,
    handlePayment (orderId: string, dataBag?: LocationQuery): Promise<void>,
    resetPayment (orderId: string, paymentMethodId: string): Promise<boolean | void>
}
