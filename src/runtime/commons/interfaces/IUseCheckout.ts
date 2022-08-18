import { Ref } from 'vue'
import { ShippingMethod } from './ShippingMethod'

export interface IUseCheckout {
    loading: Ref<boolean>,
    error: Ref<boolean | string>,
    getShippingMethods(): Promise<ShippingMethod[]>,
    setShippingMethod(id: string): Promise<void>,
    shippingMethods: Ref<null | ShippingMethod[]>
}
