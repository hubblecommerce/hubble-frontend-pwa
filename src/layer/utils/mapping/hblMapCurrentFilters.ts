import { type ProductListingResult } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { type HblProductListingFilterCurrent } from '../../types'

export function hblMapCurrentFilters (swCurrentFilters: ProductListingResult['currentFilters'], swFilters: any): HblProductListingFilterCurrent {
    const obj: HblProductListingFilterCurrent = {}

    if (swCurrentFilters?.navigationId != null) {
        obj.navigationId = swCurrentFilters.navigationId
    }

    if (swCurrentFilters.search != null) {
        obj.search = swCurrentFilters.search
    }

    obj.manufacturer = swCurrentFilters?.manufacturer

    obj.price = {
        min: swCurrentFilters.price.min !== 0 ? swCurrentFilters.price.min : '',
        max: swCurrentFilters.price.max !== 0 ? swCurrentFilters.price.max : ''
    }

    obj.rating = {
        min: '',
        max: swCurrentFilters.rating !== null ? swCurrentFilters.rating : ''
    }

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
