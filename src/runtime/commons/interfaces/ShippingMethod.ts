import { Media } from './Media'

export interface ShippingMethod {
    id: string,
    deliveryTime?: string,
    description?: string,
    media?: Media,
    name: string,
    price: number,
    tax?: number,
    position?: number
}
