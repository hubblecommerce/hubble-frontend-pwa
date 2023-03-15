import { ShippingMethod as SwShippingMethod } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { ShippingMethod } from '@hubblecommerce/hubble/commons'
import { hblMapShippingMethod } from '#imports'

export function hblMapShippingMethods (swShippingMethods: SwShippingMethod[]): ShippingMethod[] {
    return swShippingMethods.map((swShippingMethod) => {
        return hblMapShippingMethod(swShippingMethod)
    })
}
