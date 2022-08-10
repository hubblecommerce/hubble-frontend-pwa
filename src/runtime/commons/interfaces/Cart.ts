import { Media } from './Media'
import { Price } from './Product'

export interface LineItem {
    id: string,
    itemId: string,
    name: string,
    quantity: number,
    type?: string
    media?: Media,
    price?: Price
}

export interface Cart {
    id: string,
    lineItems: LineItem[],
    price: {
        subtotal: number,
        nettoPrice: number,
        bruttoPrice: number,
        tax: number,
        taxRate: number
    },
    shippingCosts?: number,
    comment?: string
}
