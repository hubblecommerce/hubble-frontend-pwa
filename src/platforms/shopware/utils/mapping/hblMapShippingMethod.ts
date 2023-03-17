import { ShippingMethod as SwShippingMethod } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { HblShippingMethod } from '@/utils/types'
import { hblMapMedia } from '#imports'

export function hblMapShippingMethod (swShippingMethod: SwShippingMethod): HblShippingMethod {
    return {
        // @ts-ignore
        id: swShippingMethod.id,
        deliveryTime: swShippingMethod.deliveryTime?.translated.name,
        description: swShippingMethod.translated.description,
        // @ts-ignore
        media: hblMapMedia(swShippingMethod.media),
        name: swShippingMethod.translated.name,
        // @ts-ignore
        price: swShippingMethod.prices[0]?.currencyPrice[0]?.gross,
        tax: swShippingMethod.tax?.taxRate,
        // @ts-ignore
        position: swShippingMethod.position != null ? swShippingMethod.position : 1
    }
}
