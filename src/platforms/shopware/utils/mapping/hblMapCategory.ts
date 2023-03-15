import { Category as SwCategory } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { Category } from '@hubblecommerce/hubble/commons'
import { hblMapMedia } from '#imports'

export function hblMapCategory (swCategory: SwCategory): Category {
    return {
        // @ts-ignore
        id: swCategory.id,
        // @ts-ignore
        active: swCategory.active,
        name: swCategory.translated.name,
        // @ts-ignore
        media: hblMapMedia(swCategory.media),
        description: swCategory.translated.description,
        // @ts-ignore
        metaTitle: swCategory.metaTitle,
        // @ts-ignore
        metaDescription: swCategory.metaDescription,
        // @ts-ignore
        url: swCategory.seoUrls[0].seoPathInfo.startsWith('/') ? swCategory.seoUrls[0].seoPathInfo : '/' + swCategory.seoUrls[0].seoPathInfo,
        pathInfo: `/navigation/${swCategory.id}`
    }
}
