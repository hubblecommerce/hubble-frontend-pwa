import { type ProductListingResult } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { type HblProductListingSorting } from '@/utils/types'
import { hblMapSorting, hblSortingIncludes } from '#imports'

export const hblSortingsIncludes = {
    ...hblSortingIncludes
}

export function hblMapSortings (swSortings: ProductListingResult['availableSortings']): HblProductListingSorting[] {
    // @ts-ignore
    return swSortings.map((swSorting) => {
        return hblMapSorting(swSorting)
    })
}
