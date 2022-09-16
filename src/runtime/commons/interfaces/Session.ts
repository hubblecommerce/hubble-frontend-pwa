import { ShippingMethod } from './ShippingMethod'
import { PaymentMethod } from './PaymentMethod'

export interface Session {
    sessionToken: string | null,
    currency?: string,
    language?: string,
    maintenance?: boolean,
    shippingMethod?: ShippingMethod,
    paymentMethod?: PaymentMethod
}
