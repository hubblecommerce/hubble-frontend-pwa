import { Ref } from 'vue'
import { ProductListing } from '@hubblecommerce/hubble/commons'

export interface IUseSearch {
    loading: Ref<boolean>,
    error: Ref<boolean | string>,
    search(term: string): Promise<ProductListing>
}
