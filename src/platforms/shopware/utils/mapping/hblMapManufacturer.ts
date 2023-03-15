import { ProductManufacturer } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { Manufacturer } from '@hubblecommerce/hubble/commons'
import { hblMapMedia } from '#imports'

export function hblMapManufacturer (swManufacturer: ProductManufacturer): Manufacturer {
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
