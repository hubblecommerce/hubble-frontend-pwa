import { type ProductMedia } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { type HblMedia } from '../../types'
import { hblMapMedia, hblMediaIncludes } from '#imports'

export const hblProductMediaIncludes = {
    'product_media': [
        'position',
        'media'
    ],
    ...hblMediaIncludes
}

export function hblMapProductMedia (swMedia: ProductMedia[]): HblMedia[] | null {
    if (swMedia === null) {
        return null
    }

    const media: HblMedia[] = []

    swMedia = swMedia.sort(function (a, b) {
        // @ts-ignore
        return a.position - b.position
    })

    swMedia.forEach((element) => {
        // @ts-ignore
        const mappedMedia = hblMapMedia(element?.media)
        if (mappedMedia != null) {
            media.push(mappedMedia)
        }
    })

    return media
}
