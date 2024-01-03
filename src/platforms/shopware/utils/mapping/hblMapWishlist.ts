import { type WishlistLoadRouteResponse as SwWishlist } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { type HblWishlist } from '@/utils/types'
import { hblMapProducts } from '#imports'

export function hblMapWishlist (wishlist: SwWishlist): HblWishlist {
    return {
        // @ts-ignore
        products: hblMapProducts(wishlist?.products?.elements)
    }
}
