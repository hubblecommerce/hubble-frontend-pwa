import { Media } from './Media'

export interface Manufacturer {
    id: string,
    link?: string,
    name: string,
    description?: string,
    media?: Media
}

export interface Price {
    regularPrice: string,
    specialPrice: string | null,
    tax: string,
    taxRate: string,
}

export interface VariantOption {
    id: string,
    name: string,
    color?: string,
    media?: Media
}

export interface VariantGroup {
    id: string,
    name: string,
    options: VariantOption[]
}

export interface Product {
    id: string,
    name: string,
    description?: string,
    sku: string,
    pathInfo: string,
    url: string,
    media?: Media[] | Media,
    active: boolean,
    stock: number,
    price: Price,
    deliveryTime?: string,
    manufacturer?: Manufacturer | null,
    metaTitle?: string,
    metaDescription?: string,
    variants?: VariantGroup[],
    defaultOptions?: string[],
    parentId?: string
}
