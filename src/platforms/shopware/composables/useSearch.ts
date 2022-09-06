import { ref, Ref } from 'vue'
import { IUseSearch, ProductListing } from '@hubblecommerce/hubble/commons'
import { ProductShopware } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { mapProductListing } from '@hubblecommerce/hubble/platforms/shopware/api-client/utils'

export function useSearch (): IUseSearch {
    const loading: Ref<boolean> = ref(false)
    const error: Ref<boolean | string> = ref(false)

    async function search (term: string, params?): Promise<{ productListing: ProductListing, params: any }> {
        try {
            loading.value = true

            // @ts-ignore
            const response = await ProductShopware.searchPage(
                'application/json',
                'application/json',
                {
                    search: term,
                    ...params
                }
            )

            loading.value = false
            return { productListing: mapProductListing(response), params }
        } catch (e) {
            loading.value = false
            error.value = e
            console.log(e)
            return e
        }
    }

    return {
        loading,
        error,
        search
    }
}
