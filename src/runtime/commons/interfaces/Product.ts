import { Media } from './Media'

export interface Manufacturer {
    id: string
}

export interface Price {
    regularPrice: number
    specialPrice: number
}

export interface Product {
    id: string,
    name: string,
    description?: string,
    sku: string,
    url: string,
    media?: Media[],
    active: boolean,
    stock: number,
    price: Price,
    deliveryTime?: string,
    manufacturer?: Manufacturer,
    metaTitle?: string,
    metaDescription?: string
}
