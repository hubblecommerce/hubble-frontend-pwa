import { type PropertyGroup } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { type HblVariantGroup } from '../../types'
import { hblMapVariantGroup, hblVariantGroupIncludes } from '#imports'

export const hblVariantGroupsIncludes = {
    ...hblVariantGroupIncludes
}

export function hblMapVariantGroups (swPropertyGroups: PropertyGroup[]): HblVariantGroup[] {
    return swPropertyGroups.map((swPropertyGroup) => {
        return hblMapVariantGroup(swPropertyGroup)
    })
}
