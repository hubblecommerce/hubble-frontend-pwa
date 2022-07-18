import { Ref, ref } from 'vue'
import { FetchRequest } from 'ohmyfetch'
import { FetchResult } from '#app'
import { IUsePage, Page, Section, PageType } from '../../../commons'
import { PwaShopware } from '../api-client/generated'
import { includes, associations, mapBreadcrumb, mapCategory, mapProduct, mapSections } from '../api-client/utils'

const defaultStructures = new Map<PageType, Section[]>()

const defaultStructure: Section[] = [
    {
        type: 'default',
        sizingMode: 'fullwidth',
        blocks: [
            {
                id: 'defaultBlock',
                type: 'default-block',
                sectionPosition: 'main',
                slots: [
                    {
                        data: 'This is a Fallback default Structure'
                    }
                ]
            }
        ]
    }
]

defaultStructures.set('category', defaultStructure)
defaultStructures.set('detail', defaultStructure)
defaultStructures.set('cms', defaultStructure)

function getDefaultStructure (type: PageType): Section[] {
    return defaultStructures.get(type)
}

function mapPage (swPage): Page {
    const obj = {
        id: swPage.resourceIdentifier,
        canonicalUrl: swPage.canonicalPathInfo,
        type: swPage.resourceType,
        structure: null
    }

    if (swPage.resourceType === 'frontend.navigation.page') {
        Object.assign(obj, { type: 'category' })
    }

    if (swPage.resourceType === 'frontend.detail.page') {
        Object.assign(obj, { type: 'detail' })
    }

    if (swPage.resourceType === 'frontend.landing.page') {
        Object.assign(obj, { type: 'cms' })
    }

    if (swPage.cmsPage === null) {
        obj.structure = getDefaultStructure(obj.type)
    } else {
        obj.structure = mapSections(swPage.cmsPage?.sections)
    }

    if (swPage.breadcrumb !== undefined) {
        Object.assign(obj, { breadcrumb: mapBreadcrumb(swPage.breadcrumb) })
    }

    if (swPage.product != null) {
        Object.assign(obj, { product: mapProduct(swPage.product) })
    }

    if (swPage.category != null) {
        Object.assign(obj, { category: mapCategory(swPage.category) })
    }

    return obj
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
                    includes,
                    associations
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
