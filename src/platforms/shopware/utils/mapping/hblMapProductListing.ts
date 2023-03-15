import { ProductListingResult } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { ProductListing } from '@hubblecommerce/hubble/commons'
import { hblMapSortings, hblMapCurrentFilters, hblMapFilters, hblMapProducts } from '#imports'

export function hblMapProductListing (swProductListing: ProductListingResult): ProductListing {
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
