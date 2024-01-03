import { type Ref } from 'vue'
import { type HblProductListing } from '@/utils/types'

export interface HblIUseSearch {
    loading: Ref<boolean>,
    error: Ref,
    // @ts-ignore
    search (term: string, params?): Promise<{ productListing: HblProductListing, params: Record<string, unknown> }>
}
