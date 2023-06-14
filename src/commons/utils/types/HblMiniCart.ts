export interface MiniCartItem {
    id: string,
    itemId: string,
    qty: number
}

export interface HblMiniCart {
    id: string,
    items: MiniCartItem[]
    qty: number
}
