import { type HblPrice } from '@/utils/types'

export const hblPriceIncludes = {
    'calculated_price': [
        'unitPrice',
        'listPrice',
        'calculatedTaxes'
    ],
    'cart_list_price': [
        'price'
    ],
    'cart_tax_calculated': [
        'tax',
        'taxRate'
    ],
}

export function hblMapPrice (calculatedPrice: any): HblPrice {
    return {
        regularPrice: calculatedPrice?.unitPrice,
        specialPrice: calculatedPrice?.listPrice?.price,
        tax: calculatedPrice?.calculatedTaxes[0]?.tax,
        taxRate: calculatedPrice?.calculatedTaxes[0]?.taxRate
    }
}
