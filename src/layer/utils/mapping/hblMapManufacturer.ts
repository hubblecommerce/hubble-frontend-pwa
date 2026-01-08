import { type ProductManufacturer } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { type HblManufacturer } from '../../types'
import { hblMapMedia, hblMediaIncludes } from '#imports'

export const hblManufacturerIncludes = {
    'product_manufacturer': [
        'id',
        'link',
        'translated',
        'name',
        'description',
        'media',
    ],
    ...hblMediaIncludes
}

export function hblMapManufacturer (swManufacturer: ProductManufacturer): HblManufacturer {
    return {
        id: swManufacturer.id,
        link: swManufacturer.link,
        name: swManufacturer?.translated?.name,
        description: swManufacturer?.translated?.description,
        // @ts-ignore
        media: hblMapMedia(swManufacturer.media)
    }
}
