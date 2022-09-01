import { Ref } from 'vue'
import { RouteLocationNormalizedLoaded } from 'vue-router'
import { Page } from './Page'
import { ProductListing, ProductListingFilterCurrent } from './ProductListing'

export interface IUsePage {
    loading: Ref<boolean>,
    error: Ref<boolean>
    getPage (route: RouteLocationNormalizedLoaded): Promise<Page>,
    page: Ref<Page>,
    getProductListing (filters: ProductListingFilterCurrent, limit: number, sort: string, page?: number): Promise<{ productListing: ProductListing, params: any }>
}
