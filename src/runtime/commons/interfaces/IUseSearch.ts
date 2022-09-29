import { Ref } from 'vue'
import { ProductListing } from '@hubblecommerce/hubble/commons'

export interface IUseSearch {
    loading: Ref<boolean>,
    error: Ref<boolean | string>,
    search (term: string, params?): Promise<{ productListing: ProductListing, params: Record<string, unknown> }>
}
