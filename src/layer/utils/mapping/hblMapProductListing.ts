import { type ProductListingResult } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { type HblProductListing } from '../../types'
import {
    hblMapSortings,
    hblSortingsIncludes,
    hblMapCurrentFilters,
    hblMapFilters,
    hblFiltersIncludes,
    hblMapProducts,
    hblProductsIncludes
} from '#imports'

export const hblProductListingIncludes = {
    'product_listing': [
        'elements',
        'sorting',
        'availableSortings',
        'currentFilters',
        'aggregations',
        'total',
        'limit',
        'page'
    ],
    ...hblProductsIncludes,
    ...hblSortingsIncludes,
    ...hblFiltersIncludes
}

export function hblMapProductListing (swProductListing: ProductListingResult): HblProductListing {
    return {
        products: hblMapProducts(swProductListing.elements),
        currentSorting: swProductListing.sorting,
        availableSorting: hblMapSortings(swProductListing.availableSortings),
        currentFilters: hblMapCurrentFilters(swProductListing.currentFilters, swProductListing.aggregations),
        availableFilters: hblMapFilters(swProductListing.aggregations),
        // @ts-ignore
        total: swProductListing.total,
        // @ts-ignore
        limit: swProductListing.limit,
        // @ts-ignore
        page: swProductListing.page
    }
}
