import { type ProductManufacturer } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { type HblManufacturer } from '@/utils/types'
import { hblMapMedia } from '#imports'

export function hblMapManufacturer (swManufacturer: ProductManufacturer): HblManufacturer {
    return {
        // @ts-ignore
        id: swManufacturer.id,
        link: swManufacturer.link,
        name: swManufacturer.translated.name,
        description: swManufacturer.translated.description,
        // @ts-ignore
        media: hblMapMedia(swManufacturer.media)
    }
}
