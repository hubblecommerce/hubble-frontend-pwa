import {
    Block,
    Breadcrumb,
    Category,
    Media,
    Page,
    Product,
    Section,
    Slot,
    useDefaultStructure
} from '../../../../commons'
import {
    Category as swCategory,
    Product as swProduct,
    CmsSection,
    CmsBlock,
    CmsSlot,
    ProductMedia,
    Media as swMedia
} from '../generated'

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
            position: slot.slot,
            data: slot.data
        }
    })
}

function mapBlocks (swBlocks: CmsBlock[]): Block[] {
    return swBlocks.map((block) => {
        return {
            id: block._uniqueIdentifier,
            type: block.type,
            cssClass: block.cssClass,
            backgroundColor: block.backgroundColor,
            backgroundMedia: mapMedia(block.backgroundMedia),
            backgroundMediaMode: block.backgroundMediaMode,
            slots: mapSlots(block.slots),
            sectionPosition: block.sectionPosition
        }
    })
}

function mapSections (swSections: CmsSection[]): Section[] {
    return swSections.map((section: CmsSection) => {
        return {
            type: section.type,
            name: section.name,
            cssClass: section.cssClass,
            sizingMode: section.sizingMode,
            backgroundColor: section.backgroundColor,
            backgroundMedia: mapMedia(section.backgroundMedia),
            backgroundMediaMode: section.backgroundMediaMode,
            mobileSidebarBehavior: section.mobileBehavior,
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

    if (swPage.cmsPage != null) {
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

export { mapCategory, mapMedia, mapProductMedia, mapBreadcrumb, mapProduct, mapSections, mapSlots, mapBlocks, mapPage }
