import { PropertyGroupOption } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { HblVariantOption } from '@/utils/types'
import { hblMapMedia } from '#imports'

export function hblMapVariantOption (swPropertyOption: PropertyGroupOption): HblVariantOption {
    return {
        // @ts-ignore
        id: swPropertyOption.id,
        name: swPropertyOption.translated.name,
        ...(swPropertyOption.colorHexCode != null && { color: swPropertyOption.colorHexCode }),
        ...(swPropertyOption.media != null && { media: hblMapMedia(swPropertyOption.media) })
    }
}
