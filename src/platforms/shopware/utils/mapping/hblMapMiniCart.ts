import { Cart, MiniCart, MiniCartItem } from '@hubblecommerce/hubble/commons'

export function hblMapMiniCart (cart: Cart): MiniCart {
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
