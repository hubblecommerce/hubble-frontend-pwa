import { type Media as SwMedia } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { type HblMedia } from '@/utils/types'

export const hblMediaIncludes = {
    'media': [
        'id',
        'url',
        'thumbnails',
        'alt',
        'title'
    ],
    'media_thumbnail': [
        'url'
    ]
}

export function hblMapMedia (swMedia: SwMedia): HblMedia | null {
    if (swMedia === null) {
        return null
    }

    return {
        id: swMedia.id,
        url: swMedia.url,
        // @ts-ignore
        thumbnails: swMedia.thumbnails,
        // @ts-ignore
        alt: swMedia.alt,
        // @ts-ignore
        title: swMedia.title
    }
}
