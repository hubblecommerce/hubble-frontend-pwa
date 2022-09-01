import { Product } from './Product'
import { Media } from './Media'

export interface FilterOption {
    id: string,
    name: string,
    media?: Media
}

export interface ProductListingFilter {
    id?: string,
    name: string,
}

export interface ProductListingFilterRange extends ProductListingFilter {
    type: 'range',
    min?: string,
    max?: string,
    avg?: string,
    sum?: string
}

export interface ProductListingFilterMulti extends ProductListingFilter {
    type: 'multi'
    options: FilterOption[]
}

export interface ProductListingFilterSingle extends ProductListingFilter {
    type: 'single'
    options: FilterOption[]
}

export interface ProductListingFilterBoolean extends ProductListingFilter {
    type: 'boolean'
}

export type ProductListingFilterMixed = ProductListingFilterRange |
    ProductListingFilterMulti | ProductListingFilterSingle | ProductListingFilterBoolean

export type ProductListingFilterCurrent = Record<string, string | Record<string, number | null | string> | string[] | boolean>

export interface ProductListingSorting {
    id: string,
    name: string
}

export interface ProductListing {
    products: Product[]
    currentSorting?: string,
    availableSorting?: ProductListingSorting[],
    currentFilters?: ProductListingFilterCurrent,
    availableFilters?: ProductListingFilterMixed[],
    total: number,
    limit: number,
    page: number
}
