import { type HblMedia } from '@/utils/types/HblMedia'
import { type HblPrice } from '@/utils/types/HblProduct'

export interface HblTotals {
    subTotal: number,
    nettoPrice: number,
    bruttoPrice: number,
    tax: number | null,
    taxRate: number | null,
}

export interface HblLineItem {
    id: string,
    itemId: string,
    sku: string | null,
    name: string,
    quantity: number,
    type?: string
    media?: HblMedia,
    price?: HblPrice
}

export interface HblCart {
    id: string,
    lineItems: HblLineItem[],
    price: HblTotals,
    shippingCosts?: number,
    comment?: string
}
