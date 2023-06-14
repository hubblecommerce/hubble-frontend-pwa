import { ref, Ref } from 'vue'
import { HblIUseSearch, HblProductListing } from '@/utils/types'
import { ProductShopware } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { hblMapProductListing } from '#imports'

export function useSearch (): HblIUseSearch {
    const loading: Ref<boolean> = ref(false)
    const error: Ref = ref(false)

    // @ts-ignore
    async function search (term: string, params?: any): Promise<{ productListing: HblProductListing, params: any }> {
        try {
            loading.value = true

            // @ts-ignore
            const response = await ProductShopware.searchPage(
                {
                    search: term,
                    ...params
                }
            )

            loading.value = false
            return { productListing: hblMapProductListing(response), params }
        } catch (e) {
            loading.value = false
            error.value = e
            throw (e)
        }
    }

    return {
        loading,
        error,
        search
    }
}
