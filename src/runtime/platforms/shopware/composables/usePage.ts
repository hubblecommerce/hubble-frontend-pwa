import { Ref, ref } from 'vue'
import { FetchRequest } from 'ohmyfetch'
import { FetchResult } from '#app'
import { IUsePage, Page, useDefaultStructure } from '@hubblecommerce/hubble/commons'
import { PwaShopware } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { includes, associations, mapPage } from '@hubblecommerce/hubble/platforms/shopware/api-client/utils'

export const usePage = function (): IUsePage {
    const loading: Ref<boolean> = ref(false)
    const error: Ref<boolean> = ref(false)
    const page: Ref<Page> = ref(null)

    const getPage = async (path: string): Promise<Page> => {
        try {
            loading.value = true
            error.value = false

            // @ts-ignore
            const response = await PwaShopware.pwaResolvePage(
                {
                    path,
                    includes,
                    associations
                }
            )

            const mappedPage = mapPage(response)

            if (mappedPage.structure === null) {
                const { setDefaultStructures, getDefaultStructureByType } = useDefaultStructure()
                setDefaultStructures()
                mappedPage.structure = getDefaultStructureByType(mappedPage.type)
            }

            loading.value = false
            return mappedPage
        } catch (e) {
            loading.value = false
            error.value = e
            throw e
        }
    }

    return {
        loading,
        error,
        getPage,
        page
    }
}
