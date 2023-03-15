import { PropertyGroup } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { VariantGroup } from '@hubblecommerce/hubble/commons'
import { hblMapVariantGroup } from '#imports'

export function hblMapVariantGroups (swPropertyGroups: PropertyGroup[]): VariantGroup[] {
    return swPropertyGroups.map((swPropertyGroup) => {
        return hblMapVariantGroup(swPropertyGroup)
    })
}
