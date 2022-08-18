import { Media } from './Media'
import { Price } from './Product'

export interface ShippingMethod {
    id: string,
    deliveryTime?: string,
    description?: string,
    media?: Media,
    name: string,
    price: Price,
    tax?: number
}
