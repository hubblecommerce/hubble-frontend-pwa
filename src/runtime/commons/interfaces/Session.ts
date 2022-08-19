import { ShippingMethod } from './ShippingMethod'

export interface Session {
    sessionToken: string | null,
    currency?: string,
    language?: string,
    maintenance?: boolean,
    shippingMethod?: ShippingMethod,
    paymentMethod?: string
}
