import { Ref } from 'vue'
import { Page } from './Page'
import { ProductListing, ProductListingFilterCurrent } from './ProductListing'

export interface IUsePage {
    loading: Ref<boolean>,
    error: Ref<boolean>
    getPage(path: string): Promise<Page>,
    page: Ref<Page>,
    getProductListing (filters: ProductListingFilterCurrent, limit: number, sort: string, page?: number): Promise<ProductListing>
}
