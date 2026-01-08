import { type CmsBlock } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { type HblBlock } from '../../types'
import { hblMapMedia, hblMediaIncludes, hblMapSlots, hblSlotIncludes } from '#imports'

export const hblBlockIncludes = {
    'cms_block': [
        'versionId',
        'type',
        'slots',
        'cssClass',
        'backgroundColor',
        'backgroundMedia',
        'backgroundMediaMode',
        'sectionPosition',
    ],
    ...hblSlotIncludes,
    ...hblMediaIncludes
}

export function hblMapBlocks (swBlocks: CmsBlock[]): HblBlock[] {
    return swBlocks.map((block: CmsBlock) => {
        return {
            id: block.versionId as string,
            type: block.type,
            slots: hblMapSlots(block.slots),
            ...(block.cssClass != null && { cssClass: block.cssClass }),
            ...(block.backgroundColor != null && { backgroundColor: block.backgroundColor }),
            ...(block.backgroundMedia != null && { backgroundMedia: hblMapMedia(block.backgroundMedia) }),
            ...(block.backgroundMediaMode != null && { backgroundMediaMode: block.backgroundMediaMode }),
            ...(block.sectionPosition != null && { sectionPosition: block.sectionPosition })
        }
    })
}
