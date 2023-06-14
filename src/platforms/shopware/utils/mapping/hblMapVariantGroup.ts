import { PropertyGroup } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { HblVariantGroup } from '@/utils/types'
import { hblMapPropertyOptions } from '#imports'

export function hblMapVariantGroup (swPropertyGroup: PropertyGroup): HblVariantGroup {
    return {
        // @ts-ignore
        id: swPropertyGroup.id,
        name: swPropertyGroup.translated.name,
        // Todo patch api
        // @ts-ignore
        options: hblMapPropertyOptions(swPropertyGroup.options)
    }
}
