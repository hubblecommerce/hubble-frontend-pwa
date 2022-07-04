import { Ref, ref } from 'vue'
import { FetchRequest } from 'ohmyfetch'
import { FetchResult } from '#app'
import { Category, IUsePage, Page } from '../../../commons'
import { Category as swCategory, PwaShopware } from '../api-client/generated'
import { includes } from '../api-client/utils'

function mapPage (swPage): Page {
    const obj = {
        id: swPage.resourceIdentifier,
        type: swPage.resourceType,
        data: swPage.cmsPage
    }

    if (swPage.category != null) {
        Object.assign(obj, { category: mapCategory(swPage.category) })
    }

    return obj
}

function mapCategory (swCategory: swCategory): Category {
    return {
        name: swCategory.name
    }
}

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
                    includes
                }
            )

            page.value = mapPage(data.value)

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
