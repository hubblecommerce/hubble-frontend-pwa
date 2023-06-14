import { ProductListingResult } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import {
    HblProductListingFilterBoolean,
    HblProductListingFilterMixed,
    HblProductListingFilterMulti,
    HblProductListingFilterRange
} from '@/utils/types'

export function hblMapFilters (swFilters: ProductListingResult['aggregations']): HblProductListingFilterMixed[] {
    const filters = []

    const manufacturerFilter: HblProductListingFilterMulti = {
        id: 'manufacturer',
        name: 'Manufacturer',
        type: 'multi',
        // TODO Patch api
        // @ts-ignore
        options: swFilters.manufacturer.entities.map((manufacturer) => {
            return {
                id: manufacturer.id,
                name: manufacturer.translated.name
            }
        })
    }

    const priceFilter: HblProductListingFilterRange = {
        id: 'price',
        type: 'range',
        name: 'HblPrice',
        // TODO Patch api
        // @ts-ignore
        min: swFilters.price.min,
        // @ts-ignore
        max: swFilters.price.max,
        // @ts-ignore
        avg: swFilters.price.avg,
        // @ts-ignore
        sum: swFilters.price.sum
    }

    const ratingFilter: HblProductListingFilterRange = {
        id: 'rating',
        type: 'range',
        name: 'Rating',
        // TODO Patch api
        // @ts-ignore
        max: swFilters.rating.max != null ? swFilters.rating.max : '0',
        min: '0'
    }

    const shippingFilter: HblProductListingFilterBoolean = {
        id: 'shipping-free',
        type: 'boolean',
        name: 'Shipping free'
    }

    filters.push(manufacturerFilter, priceFilter, ratingFilter, shippingFilter)

    // TODO Patch api
    // @ts-ignore
    swFilters.properties?.entities?.forEach((entity) => {
        const filter: HblProductListingFilterMulti = {
            id: entity.id,
            name: entity.translated.name,
            type: 'multi',
            // @ts-ignore
            options: entity.options.map((option) => {
                return {
                    id: option.id,
                    name: option.name
                }
            })
        }

        filters.push(filter)
    })

    return filters
}
