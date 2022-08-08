export interface MiniCartItem {
    id: string,
    itemId: string,
    qty: number
}

export interface MiniCart {
    id: string,
    items: MiniCartItem[]
    qty: number
}
