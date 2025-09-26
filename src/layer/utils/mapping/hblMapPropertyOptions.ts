import { type PropertyGroupOption } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { type HblVariantOption } from '../../types'
import { hblMapVariantOption } from '#imports'

export function hblMapPropertyOptions (swPropertyOptions: PropertyGroupOption[]): HblVariantOption[] {
    return swPropertyOptions.map((swPropertyOption) => {
        return hblMapVariantOption(swPropertyOption)
    })
}
