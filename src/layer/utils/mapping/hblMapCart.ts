import { type Cart as SwCart } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { type HblCart } from '../../types'
import { hblMapLineItems, hblLineItemsIncludes, hblMapTotals, hblTotalsIncludes } from '#imports'

export const hblCartIncludes = {
    'cart': [
        'token',
        'lineItems',
        'price',
        'deliveries',
        'customerComment',
        'errors'
    ],
    'cart_delivery': [
        'shippingCosts'
    ],
    ...hblLineItemsIncludes,
    ...hblTotalsIncludes,
}

export function hblMapCart (cart: SwCart): HblCart {
    return {
        // @ts-ignore
        id: cart.token,
        // @ts-ignore
        lineItems: hblMapLineItems(cart.lineItems),
        price: hblMapTotals(cart.price),
        // @TODO: Patch api client, add missing deliveries types
        // @ts-ignore
        shippingCosts: cart.deliveries.length > 0 ? cart.deliveries[0].shippingCosts.totalPrice : null,
        comment: cart.customerComment
    }
}
