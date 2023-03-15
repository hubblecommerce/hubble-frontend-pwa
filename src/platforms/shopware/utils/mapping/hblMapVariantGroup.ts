import { PropertyGroup } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { VariantGroup } from '@hubblecommerce/hubble/commons'
import { hblMapPropertyOptions } from '#imports'

export function hblMapVariantGroup (swPropertyGroup: PropertyGroup): VariantGroup {
    return {
        // @ts-ignore
        id: swPropertyGroup.id,
        name: swPropertyGroup.translated.name,
        // Todo patch api
        // @ts-ignore
        options: hblMapPropertyOptions(swPropertyGroup.options)
    }
}
