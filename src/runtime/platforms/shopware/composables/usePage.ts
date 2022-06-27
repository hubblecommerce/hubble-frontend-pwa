import { Ref, ref } from 'vue'
import { throwError, useError } from '#app'
import { IUsePage, Page } from '../../../commons'
import { PwaShopware } from '../api-client/generated'

function mapPage (swPage): Page {
    return {
        id: swPage.resourceIdentifier,
        type: swPage.resourceType,
        data: swPage.cmsPage
    }
}

export const usePage = function (): IUsePage {
    const loading: Ref<boolean> = ref(false)
    const error: Ref<boolean> = ref(false)
    const page: Ref<Page> = ref()

    const getPage = async (path: string): Promise<Page> => {
        try {
            loading.value = true
            error.value = false

            const response = await PwaShopware.pwaResolvePage(
                {
                    path
                }
            )
            const mappedPage = mapPage(response)

            page.value = mappedPage

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
