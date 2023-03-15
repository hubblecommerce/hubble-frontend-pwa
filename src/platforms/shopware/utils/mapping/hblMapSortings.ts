import { ProductListingResult } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { ProductListingSorting } from '@hubblecommerce/hubble/commons'
import { hblMapSorting } from '#imports'

export function hblMapSortings (swSortings: ProductListingResult['availableSortings']): ProductListingSorting[] {
    // @ts-ignore
    return swSortings.map((swSorting) => {
        return hblMapSorting(swSorting)
    })
}
