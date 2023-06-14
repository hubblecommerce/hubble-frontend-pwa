import { HblCart, HblMiniCart, MiniCartItem } from '@/utils/types'

export function hblMapMiniCart (cart: HblCart): HblMiniCart {
    let quantity = 0
    const items: MiniCartItem[] = []
    cart.lineItems.forEach((lineItem) => {
        quantity = quantity + lineItem.quantity

        items.push({
            id: lineItem.id,
            itemId: lineItem.itemId,
            qty: lineItem.quantity
        })
    })

    return {
        id: cart.id,
        items,
        qty: quantity
    }
}
