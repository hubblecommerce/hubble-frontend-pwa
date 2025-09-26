import { type CmsSection } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { type HblSection } from '../../types'
import { hblMapMedia, hblMediaIncludes, hblMapBlocks, hblBlockIncludes } from '#imports'

export const hblSectionIncludes = {
    'cms_section': [
        'type',
        'name',
        'sizingMode',
        'blocks',
        'cssClass',
        'backgroundColor',
        'backgroundMedia',
        'backgroundMediaMode',
        'mobileBehavior',
    ],
    ...hblBlockIncludes,
    ...hblMediaIncludes
}

export function hblMapSections (swSections: CmsSection[]): HblSection[] {
    return swSections.map((section: CmsSection) => {
        return {
            type: section.type,
            name: section.name,
            sizingMode: section.sizingMode != null ? section.sizingMode : 'boxed',
            blocks: hblMapBlocks(section.blocks),
            ...(section.cssClass != null && { cssClass: section.cssClass }),
            ...(section.backgroundColor != null && { backgroundColor: section.backgroundColor }),
            ...(section.backgroundMedia != null && { backgroundMedia: hblMapMedia(section.backgroundMedia) }),
            ...(section.backgroundMediaMode != null && { backgroundMediaMode: section.backgroundMediaMode }),
            ...(section.mobileBehavior != null && { mobileSidebarBehavior: section.mobileBehavior })
        }
    })
}
