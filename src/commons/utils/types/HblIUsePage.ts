import { Ref } from 'vue'
import { RouteLocationNormalizedLoaded } from 'vue-router'
import { HblPage } from '@/utils/types/HblPage'
import { HblProductListing, HblProductListingFilterCurrent } from '@/utils/types/HblProductListing'
import { HblProduct } from '@/utils/types/HblProduct'

export interface HblIUsePage {
    loading: Ref<boolean>,
    error: Ref,
    getPage (route: RouteLocationNormalizedLoaded): Promise<HblPage>,
    page: Ref<HblPage | null>,
    getProductListing (filters: HblProductListingFilterCurrent, limit: number, sort: string, page?: number): Promise<{ productListing: HblProductListing, params: Record<string, unknown> }>,
    // @ts-ignore
    updateUri (params): void,
    getProductVariant (parentId: string, selectedOptions: Record<string, string>): Promise<HblProduct | void>,
    // @ts-ignore
    parseParamsFromQuery (route: RouteLocationNormalizedLoaded)
}
