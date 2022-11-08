import { Ref } from 'vue'
import { RouteLocationNormalizedLoaded } from 'vue-router'
import { Page } from './Page'
import { ProductListing, ProductListingFilterCurrent } from './ProductListing'
import { Product } from './Product'

export interface IUsePage {
    loading: Ref<boolean>,
    error: Ref,
    getPage (route: RouteLocationNormalizedLoaded): Promise<Page>,
    page: Ref<Page | null>,
    getProductListing (filters: ProductListingFilterCurrent, limit: number, sort: string, page?: number): Promise<{ productListing: ProductListing, params: Record<string, unknown> }>,
    // @ts-ignore
    updateUri (params): void,
    getProductVariant (parentId: string, selectedOptions: Record<string, string>): Promise<Product | void>,
    // @ts-ignore
    parseParamsFromQuery (route: RouteLocationNormalizedLoaded)
}
