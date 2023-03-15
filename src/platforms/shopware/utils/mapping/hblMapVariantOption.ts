import { PropertyGroupOption } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { VariantOption } from '@hubblecommerce/hubble/commons'
import { hblMapMedia } from '#imports'

export function hblMapVariantOption (swPropertyOption: PropertyGroupOption): VariantOption {
    return {
        // @ts-ignore
        id: swPropertyOption.id,
        name: swPropertyOption.translated.name,
        ...(swPropertyOption.colorHexCode != null && { color: swPropertyOption.colorHexCode }),
        ...(swPropertyOption.media != null && { media: hblMapMedia(swPropertyOption.media) })
    }
}
