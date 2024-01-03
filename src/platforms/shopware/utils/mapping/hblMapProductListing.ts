import { type ProductListingResult } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { type HblProductListing } from '@/utils/types'
import { hblMapSortings, hblMapCurrentFilters, hblMapFilters, hblMapProducts } from '#imports'

export function hblMapProductListing (swProductListing: ProductListingResult): HblProductListing {
    return {
        // @ts-ignore
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
