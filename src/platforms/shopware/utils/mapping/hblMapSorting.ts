import { type HblProductListingSorting } from '@/utils/types'

export function hblMapSorting (swSorting: any): HblProductListingSorting {
    return {
        id: swSorting.key,
        name: swSorting.translated.label
    }
}
