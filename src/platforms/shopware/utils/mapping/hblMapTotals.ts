import { Totals } from '@hubblecommerce/hubble/commons'

export function hblMapTotals (price: any): Totals {
    return {
        subTotal: price.positionPrice,
        nettoPrice: price.netPrice,
        bruttoPrice: price.totalPrice,
        // @ts-ignore
        tax: price.calculatedTaxes.length > 0 ? price.calculatedTaxes[0].tax : null,
        // @ts-ignore
        taxRate: price.calculatedTaxes.length > 0 ? price.calculatedTaxes[0].taxRate : null
    }
}
