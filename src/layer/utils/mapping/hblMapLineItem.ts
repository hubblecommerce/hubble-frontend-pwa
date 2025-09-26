import { type LineItem as SwLineItem } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { type HblLineItem } from '../../types'
import { hblMapMedia, hblMediaIncludes, hblMapPrice, hblPriceIncludes } from '#imports'

export const hblLineItemIncludes = {
    'cart_line_item': [
        'id',
        'referencedId',
        'payload',
        'label',
        'quantity',
        'type',
        'cover',
        'price'
    ],
    ...hblMediaIncludes,
    ...hblPriceIncludes
}

export function hblMapLineItem (lineItem: SwLineItem): HblLineItem {
    return {
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
