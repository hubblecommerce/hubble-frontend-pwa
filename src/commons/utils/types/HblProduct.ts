import { type HblMedia } from '@/utils/types/HblMedia'

export interface HblManufacturer {
    id: string,
    link?: string,
    name: string,
    description?: string,
    media?: HblMedia
}

export interface HblPrice {
    regularPrice: string,
    specialPrice: string | null,
    tax: string,
    taxRate: string,
}

export interface HblTierPrice extends HblPrice {
    qty: number
}

export interface HblVariantOption {
    id: string,
    name: string,
    color?: string,
    media?: HblMedia
}

export interface HblVariantGroup {
    id: string,
    name: string,
    options: HblVariantOption[]
}

export interface HblProduct {
    id: string,
    name: string,
    description?: string,
    sku: string,
    url: string,
    media?: HblMedia[] | HblMedia,
    active: boolean,
    stock: number,
    price: HblPrice,
    priceRange: boolean,
    variantsFrom: boolean,
    cheapestPrice: HblPrice,
    tierPrices: HblTierPrice[],
    deliveryTime?: string,
    manufacturer?: HblManufacturer | null,
    metaTitle?: string,
    metaDescription?: string,
    variants?: HblVariantGroup[],
    defaultOptions?: string[],
    parentId?: string
}
