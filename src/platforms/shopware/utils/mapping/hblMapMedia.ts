import { Media as SwMedia } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { Media } from '@hubblecommerce/hubble/commons'

export function hblMapMedia (swMedia: SwMedia): Media | null {
    if (swMedia === null) {
        return null
    }

    return {
        id: swMedia.id,
        // @ts-ignore
        url: swMedia.url,
        // @ts-ignore
        thumbnails: swMedia.thumbnails,
        // @ts-ignore
        alt: swMedia.alt,
        // @ts-ignore
        title: swMedia.title
    }
}
