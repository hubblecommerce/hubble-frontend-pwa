import { Media } from './Media'
import { Price } from './Product'

export interface Totals {
    subTotal: number,
    nettoPrice: number,
    bruttoPrice: number,
    tax: number | null,
    taxRate: number | null,
}

export interface LineItem {
    id: string,
    itemId: string,
    sku: string | null,
    name: string,
    quantity: number,
    type?: string
    media?: Media,
    price?: Price
}

export interface Cart {
    id: string,
    lineItems: LineItem[],
    price: Totals,
    shippingCosts?: number,
    comment?: string
}
