import { type HblShippingMethod } from './HblShippingMethod'
import { type HblPaymentMethod } from './HblPaymentMethod'

export interface HblSession {
    sessionToken: string | null,
    currency?: string,
    language?: string,
    maintenance?: boolean,
    shippingMethod?: HblShippingMethod,
    paymentMethod?: HblPaymentMethod
}
