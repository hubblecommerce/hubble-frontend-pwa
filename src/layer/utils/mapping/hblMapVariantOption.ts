import { type PropertyGroupOption } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { type HblVariantOption } from '../../types'
import { hblMapMedia, hblMediaIncludes } from '#imports'

export const hblVariantOptionIncludes = {
    'property_group_option': [
        'id',
        'translated',
        'name',
        'colorHexCode',
        'media'
    ],
    ...hblMediaIncludes
}

export function hblMapVariantOption (swPropertyOption: PropertyGroupOption): HblVariantOption {
    // @ts-ignore
    return {
        id: swPropertyOption.id,
        name: swPropertyOption?.translated?.name,
        ...(swPropertyOption.colorHexCode != null && { color: swPropertyOption.colorHexCode }),
        ...(swPropertyOption.media != null && { media: hblMapMedia(swPropertyOption.media) })
    }
}
