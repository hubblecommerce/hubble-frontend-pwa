export interface LineItem {
    id: string,
    itemId: string,
    name: string,
    quantity: number,
    type?: string
}

export interface Cart {
    id: string,
    lineItems: LineItem[],
    price: {
        nettoPrice: number,
        bruttoPrice: number,
        tax: number,
        taxRate: number
    },
    shippingCosts?: number,
    comment?: string
}
