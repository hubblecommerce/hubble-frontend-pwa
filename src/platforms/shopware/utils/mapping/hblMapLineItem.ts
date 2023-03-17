import { LineItem as SwLineItem } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { HblLineItem } from '@/utils/types'
import { hblMapMedia, hblMapPrice } from '#imports'

export function hblMapLineItem (lineItem: SwLineItem): HblLineItem {
    return {
        // @ts-ignore
        id: lineItem.id,
        // @ts-ignore
        itemId: lineItem.referencedId,
        // @TODO Patch api client
        // @ts-ignore
        sku: lineItem.payload?.productNumber,
        // @ts-ignore
        name: lineItem.label,
        // @ts-ignore
        quantity: lineItem.quantity,
        type: lineItem.type,
        // @ts-ignore
        media: hblMapMedia(lineItem.cover),
        // @ts-ignore
        price: hblMapPrice(lineItem.price)
    }
}
