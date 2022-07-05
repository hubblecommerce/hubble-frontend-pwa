import { Ref, ref } from 'vue'
import { FetchRequest } from 'ohmyfetch'
import { FetchResult } from '#app'
import {
    Category,
    IUsePage,
    Page,
    Section,
    Block,
    Slot,
    PageType,
    Breadcrumb,
    Product,
    Media
} from '../../../commons'
import {
    Category as swCategory,
    Product as swProduct,
    CmsSection,
    CmsBlock,
    CmsSlot,
    PwaShopware,
    ProductMedia,
    Media as swMedia
} from '../api-client/generated'
import { includes, associations } from '../api-client/utils'

function mapMedia (swMedia: swMedia): Media {
    if (swMedia === null) {
        return null
    }

    return {
        id: swMedia.id,
        url: swMedia.url,
        thumbnails: swMedia.thumbnails,
        alt: swMedia.alt,
        title: swMedia.title
    }
}

function mapProductMedia (swMedia: ProductMedia[]): Media[] | null {
    if (swMedia === null) {
        return null
    }

    const media = []

    swMedia = swMedia.sort(function (a, b) {
        return a.position - b.position
    })

    swMedia.forEach((element) => {
        media.push(mapMedia(element.media))
    })

    return media
}

function mapProduct (swProduct: swProduct): Product {
    return {
        id: swProduct.id,
        name: swProduct.translated.name,
        description: swProduct.translated.description,
        sku: swProduct.productNumber,
        url: swProduct.seoUrls[0].seoPathInfo,
        media: mapProductMedia(swProduct.media),
        active: swProduct.available,
        stock: swProduct.stock,
        price: {
            regularPrice: swProduct.calculatedPrice.listPrice,
            specialPrice: swProduct.calculatedPrice.listPrice
        },
        deliveryTime: swProduct.deliveryTime?.name,
        manufacturer: {
            id: swProduct.manufacturer?.id
        }
    }
}

function mapBreadcrumb (swBreadcrumb): Breadcrumb {
    return swBreadcrumb
}

function mapSlots (swSlots: CmsSlot[]): Slot[] {
    return swSlots.map((slot: CmsSlot) => {
        return {
            type: slot.type,
            slot: slot.slot,
            data: slot.data
        }
    })
}

function mapBlocks (swBlocks: CmsBlock[]): Block[] {
    return swBlocks.map((block) => {
        return {
            id: block.id,
            slots: mapSlots(block.slots)
        }
    })
}

function mapSections (swSections: CmsSection[]): Section[] {
    return swSections.map((section: CmsSection) => {
        return {
            id: section.id,
            blocks: mapBlocks(section.blocks)
        }
    })
}

function mapCategory (swCategory: swCategory): Category {
    return {
        id: swCategory.id,
        active: swCategory.active,
        name: swCategory.translated.name,
        media: mapMedia(swCategory.media),
        description: swCategory.translated.description,
        metaTitle: swCategory.metaTitle,
        metaDescription: swCategory.metaDescription
    }
}

const defaultStructures = new Map<PageType, Section[]>()

const defaultStructure: Section[] = [
    {
        id: 'defaultSection',
        blocks: [
            {
                id: 'defaultBlock',
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

function setDefaultStructure (type: PageType): Section[] {
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
        obj.structure = setDefaultStructure(obj.type)
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
