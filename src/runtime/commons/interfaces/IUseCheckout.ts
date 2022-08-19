import { Ref } from 'vue'
import { ShippingMethod } from './ShippingMethod'
import { PaymentMethod } from './PaymentMethod'

export interface IUseCheckout {
    loading: Ref<boolean>,
    error: Ref<boolean | string>,
    shippingMethods: Ref<null | ShippingMethod[]>,
    getShippingMethods(): Promise<ShippingMethod[]>,
    setShippingMethod(id: string): Promise<void>,
    paymentMethods: Ref<null | PaymentMethod[]>,
    getPaymentMethods(): Promise<PaymentMethod[]>,
    setPaymentMethod(id: string): Promise<void>
}
