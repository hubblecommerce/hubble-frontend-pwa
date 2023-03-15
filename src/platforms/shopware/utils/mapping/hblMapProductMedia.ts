import { ProductMedia } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { Media } from '@hubblecommerce/hubble/commons'
import { hblMapMedia } from '#imports'

export function hblMapProductMedia (swMedia: ProductMedia[]): Media[] | null {
    if (swMedia === null) {
        return null
    }

    const media: Media[] = []

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
