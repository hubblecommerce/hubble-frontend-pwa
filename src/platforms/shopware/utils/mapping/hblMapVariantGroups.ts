import { type PropertyGroup } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { type HblVariantGroup } from '@/utils/types'
import { hblMapVariantGroup } from '#imports'

export function hblMapVariantGroups (swPropertyGroups: PropertyGroup[]): HblVariantGroup[] {
    return swPropertyGroups.map((swPropertyGroup) => {
        return hblMapVariantGroup(swPropertyGroup)
    })
}
