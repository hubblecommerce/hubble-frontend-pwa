import { type ShippingMethod as SwShippingMethod } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { type HblShippingMethod } from '../../types'
import { hblMapShippingMethod } from '#imports'

export function hblMapShippingMethods (swShippingMethods: SwShippingMethod[]): HblShippingMethod[] {
    return swShippingMethods.map((swShippingMethod) => {
        return hblMapShippingMethod(swShippingMethod)
    })
}
