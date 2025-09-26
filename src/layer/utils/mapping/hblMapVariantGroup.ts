import { type PropertyGroup } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { type HblVariantGroup } from '../../types'
import { hblMapPropertyOptions, hblVariantOptionIncludes } from '#imports'

export const hblVariantGroupIncludes = {
    'property_group': [
        'id',
        'translated',
        'name',
        'options',
    ],
    ...hblVariantOptionIncludes
}

export function hblMapVariantGroup (swPropertyGroup: PropertyGroup): HblVariantGroup {
    return {
        id: swPropertyGroup.id,
        name: swPropertyGroup?.translated?.name,
        // Todo patch api
        // @ts-ignore
        options: hblMapPropertyOptions(swPropertyGroup.options)
    }
}
