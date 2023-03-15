import { Page } from '@hubblecommerce/hubble/commons'
import { hblMapCategory, hblMapBreadcrumb, hblMapProduct, hblMapSections } from '#imports'

export function hblMapPage (swPage: any): Page {
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
        // @ts-ignore
        obj.structure = hblMapSections(swPage.cmsPage?.sections)

        Object.assign(obj, { cms: { content: swPage.cmsPage.name } })
    }

    if (swPage.breadcrumb !== undefined) {
        Object.assign(obj, { breadcrumb: hblMapBreadcrumb(swPage.breadcrumb) })
    }

    if (swPage.product != null) {
        Object.assign(obj, {
            detail: hblMapProduct(
                swPage.product,
                swPage.configurator != null ? swPage.configurator : null
            )
        })
    }

    if (swPage.category != null) {
        Object.assign(obj, { category: hblMapCategory(swPage.category) })
    }

    return obj
}
