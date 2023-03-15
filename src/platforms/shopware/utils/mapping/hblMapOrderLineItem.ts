import { OrderLineItem as SwOrderLineItem } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { OrderLineItem } from '@hubblecommerce/hubble/commons'
import { hblMapMedia } from '#imports'

export function hblMapOrderLineItem (swOrderLineItem: SwOrderLineItem): OrderLineItem {
    return {
        // @ts-ignore
        id: swOrderLineItem.id,
        name: swOrderLineItem.label,
        // @ts-ignore
        media: hblMapMedia(swOrderLineItem.cover),
        quantity: swOrderLineItem.quantity,
        // @ts-ignore
        price: swOrderLineItem.totalPrice
    }
}
