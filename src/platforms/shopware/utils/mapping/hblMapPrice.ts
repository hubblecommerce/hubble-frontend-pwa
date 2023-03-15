import { Price } from '@hubblecommerce/hubble/commons'

export function hblMapPrice (calculatedPrice: any): Price {
    return {
        regularPrice: calculatedPrice?.unitPrice,
        specialPrice: calculatedPrice?.listPrice?.price,
        tax: calculatedPrice?.calculatedTaxes[0]?.tax,
        taxRate: calculatedPrice?.calculatedTaxes[0]?.taxRate
    }
}
