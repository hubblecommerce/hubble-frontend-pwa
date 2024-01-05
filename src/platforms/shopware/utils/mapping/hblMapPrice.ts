import { type HblPrice } from '@/utils/types'

export function hblMapPrice (calculatedPrice: any): HblPrice {
    return {
        regularPrice: calculatedPrice?.unitPrice,
        specialPrice: calculatedPrice?.listPrice?.price,
        tax: calculatedPrice?.calculatedTaxes[0]?.tax,
        taxRate: calculatedPrice?.calculatedTaxes[0]?.taxRate
    }
}
