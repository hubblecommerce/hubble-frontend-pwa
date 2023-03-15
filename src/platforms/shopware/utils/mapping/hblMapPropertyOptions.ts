import { PropertyGroupOption } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { VariantOption } from '@hubblecommerce/hubble/commons'
import { hblMapVariantOption } from '#imports'

export function hblMapPropertyOptions (swPropertyOptions: PropertyGroupOption[]): VariantOption[] {
    return swPropertyOptions.map((swPropertyOption) => {
        return hblMapVariantOption(swPropertyOption)
    })
}
