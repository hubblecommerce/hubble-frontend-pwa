import { type Ref } from 'vue'
import { type RouteLocationNormalizedLoaded } from 'vue-router'
import { type HblPage } from './HblPage'
import { type HblProductListing, type HblProductListingFilterCurrent } from './HblProductListing'
import { type HblProduct } from './HblProduct'

export interface HblIUsePage {
    loading: Ref<boolean>,
    error: Ref,
    getPage (route: RouteLocationNormalizedLoaded): Promise<HblPage>,
    page: Ref<HblPage | null>,
    getProductListing (filters: HblProductListingFilterCurrent, limit: number, sort: string, page?: number): Promise<{ productListing: HblProductListing, params: Record<string, unknown> }>,
    // @ts-ignore
    updateUri (params): void,
    getProductVariant (parentId: string, selectedOptions: Record<string, string>, switchedOption: string, switchedGroup: string): Promise<HblProduct | void>,
    // @ts-ignore
    parseParamsFromQuery (route: RouteLocationNormalizedLoaded)
}
