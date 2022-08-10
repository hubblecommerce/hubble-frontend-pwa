import { ref, Ref } from 'vue'
import { IUseSearch, ProductListing } from '@hubblecommerce/hubble/commons'
import { ProductShopware } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { mapProductListing } from '@hubblecommerce/hubble/platforms/shopware/api-client/utils'

export function useSearch (): IUseSearch {
    const loading: Ref<boolean> = ref(false)
    const error: Ref<boolean | string> = ref(false)

    async function search (term: string): Promise<ProductListing> {
        try {
            loading.value = true

            // @ts-ignore
            const { data } = await ProductShopware.searchPage(
                'application/json',
                'application/json',
                {
                    search: term
                }
            )

            loading.value = false
            return mapProductListing(data.value)
        } catch (e) {
            loading.value = false
            error.value = e
            return e
        }
    }

    return {
        loading,
        error,
        search
    }
}
