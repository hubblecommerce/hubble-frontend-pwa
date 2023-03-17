import { ProductListingResult } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { HblProductListingSorting } from '@/utils/types'
import { hblMapSorting } from '#imports'

export function hblMapSortings (swSortings: ProductListingResult['availableSortings']): HblProductListingSorting[] {
    // @ts-ignore
    return swSortings.map((swSorting) => {
        return hblMapSorting(swSorting)
    })
}
