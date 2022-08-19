import { Media } from './Media'

export interface ShippingMethod {
    id: string,
    position: number,
    name: string,
    deliveryTime?: string,
    description?: string,
    media?: Media,
    price: number,
    tax?: number
}
