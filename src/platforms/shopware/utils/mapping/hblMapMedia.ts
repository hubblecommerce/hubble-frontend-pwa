import { Media as SwMedia } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { HblMedia } from '@/utils/types'

export function hblMapMedia (swMedia: SwMedia): HblMedia | null {
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
