import { type OrderLineItem as SwOrderLineItem } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { type HblOrderLineItem } from '../../types'
import { hblMapMedia, hblMapOrderLineItemDownloads } from '#imports'

export function hblMapOrderLineItem (swOrderLineItem: SwOrderLineItem): HblOrderLineItem {
    return {
        id: swOrderLineItem.id,
        name: swOrderLineItem.label,
        // @ts-ignore
        media: hblMapMedia(swOrderLineItem.cover),
        quantity: swOrderLineItem.quantity,
        // @ts-ignore
        price: swOrderLineItem.totalPrice,
        // @ts-ignore
        ...(swOrderLineItem?.downloads?.length > 0 && { downloads: hblMapOrderLineItemDownloads(swOrderLineItem?.downloads) })
    }
}
