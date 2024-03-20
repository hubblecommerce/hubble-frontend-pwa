import { type ProductListingResult } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import {
    type HblProductListingFilterBoolean,
    type HblProductListingFilterMixed,
    type HblProductListingFilterMulti,
    type HblProductListingFilterRange
} from '@/utils/types'

export function hblMapFilters (swFilters: ProductListingResult['aggregations']): HblProductListingFilterMixed[] {
    const filters = []

    // @ts-ignore
    if (swFilters?.manufacturer != null) {
        const manufacturerFilter: HblProductListingFilterMulti = {
            id: 'manufacturer',
            name: 'Manufacturer',
            type: 'multi',
            // @ts-ignore
            options: swFilters.manufacturer.entities.map((manufacturer) => {
                return {
                    id: manufacturer.id,
                    name: manufacturer.translated.name
                }
            })
        }

        filters.push(manufacturerFilter)
    }

    // @ts-ignore
    if (swFilters?.price != null) {
        const priceFilter: HblProductListingFilterRange = {
            id: 'price',
            type: 'range',
            name: 'price',
            // @ts-ignore
            min: swFilters.price.min,
            // @ts-ignore
            max: swFilters.price.max,
            // @ts-ignore
            avg: swFilters.price.avg,
            // @ts-ignore
            sum: swFilters.price.sum
        }

        filters.push(priceFilter)
    }

    // @ts-ignore
    if (swFilters?.rating != null) {
        const ratingFilter: HblProductListingFilterRange = {
            id: 'rating',
            type: 'range',
            name: 'Rating',
            // @ts-ignore
            max: swFilters?.rating?.max != null ? swFilters?.rating?.max : '0',
            min: '0'
        }

        filters.push(ratingFilter)
    }

    // @ts-ignore
    if (swFilters?.['shipping-free'] != null) {
        const shippingFilter: HblProductListingFilterBoolean = {
            id: 'shipping-free',
            type: 'boolean',
            name: 'Shipping free'
        }

        filters.push(shippingFilter)
    }

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
                    name: option.name,
                    colorHexCode: option.colorHexCode,
                    media: option.media
                }
            })
        }

        filters.push(filter)
    })

    return filters
}
