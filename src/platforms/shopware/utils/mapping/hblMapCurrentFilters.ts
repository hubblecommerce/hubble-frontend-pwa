import { ProductListingResult } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { HblProductListingFilterCurrent } from '@/utils/types'

export function hblMapCurrentFilters (swCurrentFilters: ProductListingResult['currentFilters'], swFilters: any): HblProductListingFilterCurrent {
    const obj: HblProductListingFilterCurrent = {}

    if (swCurrentFilters?.navigationId != null) {
        obj.navigationId = swCurrentFilters.navigationId
    }

    // TODO Patch api
    // @ts-ignore
    if (swCurrentFilters.search != null) {
        // @ts-ignore
        obj.search = swCurrentFilters.search
    }

    // @ts-ignore
    obj.manufacturer = swCurrentFilters?.manufacturer

    // @ts-ignore
    obj.price = {
        // @ts-ignore
        min: swCurrentFilters.price.min !== 0 ? swCurrentFilters.price.min : '',
        // @ts-ignore
        max: swCurrentFilters.price.max !== 0 ? swCurrentFilters.price.max : ''
    }

    // @ts-ignore
    obj.rating = {
        min: '',
        // @ts-ignore
        max: swCurrentFilters.rating !== null ? swCurrentFilters.rating : ''
    }

    // @ts-ignore
    obj['shipping-free'] = swCurrentFilters['shipping-free']

    // @ts-ignore
    swFilters.properties?.entities?.forEach((entity) => {
        // @ts-ignore
        const match = entity.options.filter((option) => {
            // @ts-ignore
            return swCurrentFilters.properties.includes(option.id)
        })

        const arrayOfIds: string[] = []
        // @ts-ignore
        match.forEach((option) => {
            arrayOfIds.push(option.id)
        })

        obj[entity.id] = arrayOfIds
    })

    return obj
}
