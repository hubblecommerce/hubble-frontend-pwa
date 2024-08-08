import { type PropertyGroup } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { type HblVariantGroup } from '@/utils/types'
import { hblMapPropertyOptions } from '#imports'

export function hblMapVariantGroup (swPropertyGroup: PropertyGroup): HblVariantGroup {
    return {
        id: swPropertyGroup.id,
        name: swPropertyGroup?.translated?.name,
        // Todo patch api
        // @ts-ignore
        options: hblMapPropertyOptions(swPropertyGroup.options)
    }
}
