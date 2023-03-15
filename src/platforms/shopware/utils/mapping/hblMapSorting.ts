import { ProductListingSorting } from '@hubblecommerce/hubble/commons'

export function hblMapSorting (swSorting: any): ProductListingSorting {
    return {
        id: swSorting.key,
        name: swSorting.translated.label
    }
}
