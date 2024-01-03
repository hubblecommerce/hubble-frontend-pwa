import { type Cart as SwCart } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { type HblCart } from '@/utils/types'
import { hblMapLineItems, hblMapTotals } from '#imports'

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
