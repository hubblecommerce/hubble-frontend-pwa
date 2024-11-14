import { type HblProductListingSorting } from '@/utils/types'

export const hblSortingIncludes = {
    'product_sorting': [
        'key',
        'translated',
        'label',
    ],
}

export function hblMapSorting (swSorting: any): HblProductListingSorting {
    return {
        id: swSorting.key,
        name: swSorting.translated.label
    }
}
