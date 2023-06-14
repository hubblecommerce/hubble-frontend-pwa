import { HblProduct } from '@/utils/types/HblProduct'
import { HblMedia } from '@/utils/types/HblMedia'

export interface HblFilterOption {
    id: string,
    name: string,
    media?: HblMedia
}

export interface HblProductListingFilter {
    id?: string,
    name: string,
}

export interface HblProductListingFilterRange extends HblProductListingFilter {
    type: 'range',
    min?: string,
    max?: string,
    avg?: string,
    sum?: string
}

export interface HblProductListingFilterMulti extends HblProductListingFilter {
    type: 'multi'
    options: HblFilterOption[]
}

export interface HblProductListingFilterSingle extends HblProductListingFilter {
    type: 'single'
    options: HblFilterOption[]
}

export interface HblProductListingFilterBoolean extends HblProductListingFilter {
    type: 'boolean'
}

export type HblProductListingFilterMixed = HblProductListingFilterRange |
    HblProductListingFilterMulti | HblProductListingFilterSingle | HblProductListingFilterBoolean

export type HblProductListingFilterCurrent = Record<string, string | Record<string, number | null | string> | string[] | boolean>

export interface HblProductListingSorting {
    id: string,
    name: string
}

export interface HblProductListing {
    products: HblProduct[]
    currentSorting?: string,
    availableSorting?: HblProductListingSorting[],
    currentFilters?: HblProductListingFilterCurrent,
    availableFilters?: HblProductListingFilterMixed[],
    total: number,
    limit: number,
    page: number
}
