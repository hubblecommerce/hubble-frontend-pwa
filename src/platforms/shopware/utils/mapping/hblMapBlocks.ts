import { type CmsBlock } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { type HblBlock } from '@/utils/types'
import { hblMapMedia, hblMapSlots } from '#imports'

export function hblMapBlocks (swBlocks: CmsBlock[]): HblBlock[] {
    return swBlocks.map((block: CmsBlock) => {
        return {
            id: block._uniqueIdentifier,
            type: block.type,
            // @ts-ignore
            slots: hblMapSlots(block.slots),
            ...(block.cssClass != null && { cssClass: block.cssClass }),
            ...(block.backgroundColor != null && { backgroundColor: block.backgroundColor }),
            ...(block.backgroundMedia != null && { backgroundMedia: hblMapMedia(block.backgroundMedia) }),
            ...(block.backgroundMediaMode != null && { backgroundMediaMode: block.backgroundMediaMode }),
            ...(block.sectionPosition != null && { sectionPosition: block.sectionPosition })
        }
    })
}
