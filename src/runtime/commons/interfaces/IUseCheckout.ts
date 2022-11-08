import { Ref } from 'vue'
import { LocationQuery } from 'vue-router'
import { ShippingMethod } from './ShippingMethod'
import { PaymentMethod } from './PaymentMethod'

export interface IUseCheckout {
    loading: Ref<boolean>,
    error: Ref,
    shippingMethods: Ref<null | ShippingMethod[]>,
    getShippingMethods(): Promise<ShippingMethod[] | void>,
    setShippingMethod(id: string): Promise<void>,
    shippingError: Ref,
    paymentMethods: Ref<null | PaymentMethod[]>,
    getPaymentMethods(): Promise<PaymentMethod[] | void>,
    setPaymentMethod(id: string): Promise<void>,
    paymentError: Ref,
    placeOrder(): Promise<boolean | string>,
    validateCheckout(): boolean,
    orderComment: Ref<string>,
    handlePayment (orderId: string, dataBag?: LocationQuery): Promise<void>,
    resetPayment (orderId: string, paymentMethodId: string): Promise<boolean | void>
}
