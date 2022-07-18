import { Ref, ref } from 'vue'
import { FetchRequest } from 'ohmyfetch'
import { FetchResult } from '#app'
import { IUsePage, Page, useDefaultStructure } from '../../../commons'
import { PwaShopware } from '../api-client/generated'
import { includes, associations, mapPage } from '../api-client/utils'

export const usePage = function (): IUsePage {
    const loading: Ref<boolean> = ref(false)
    const error: Ref<boolean> = ref(false)
    const page: Ref<Page> = ref(null)

    const getPage = async (path: string): Promise<FetchResult<FetchRequest>> => {
        try {
            loading.value = true
            error.value = false

            // @ts-ignore
            const { data, pending, refresh } = await PwaShopware.pwaResolvePage(
                {
                    path,
                    includes,
                    associations
                }
            )

            page.value = mapPage(data.value)

            if (page.value.structure === null) {
                const { setDefaultStructures, getDefaultStructureByType } = useDefaultStructure()
                setDefaultStructures()
                page.value.structure = getDefaultStructureByType(page.value.type)
            }

            loading.value = false
            return { data, pending, refresh }
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
