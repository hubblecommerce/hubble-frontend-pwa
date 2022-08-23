import { Ref } from 'vue'
import { LocationQuery } from 'vue-router'
import { ShippingMethod } from './ShippingMethod'
import { PaymentMethod } from './PaymentMethod'
import { Order } from './Order'

export interface IUseCheckout {
    loading: Ref<boolean>,
    error: Ref<boolean | string>,
    shippingMethods: Ref<null | ShippingMethod[]>,
    getShippingMethods(): Promise<ShippingMethod[]>,
    setShippingMethod(id: string): Promise<void>,
    shippingError: Ref<string | boolean>,
    paymentMethods: Ref<null | PaymentMethod[]>,
    getPaymentMethods(): Promise<PaymentMethod[]>,
    setPaymentMethod(id: string): Promise<void>,
    paymentError: Ref<string | boolean>,
    placeOrder(): Promise<boolean | string>,
    validateCheckout(): boolean,
    orderComment: Ref<string>,
    handlePayment (orderId: string, dataBag?: LocationQuery): Promise<void>,
    getOrders (id?: string): Promise<Order>
}
