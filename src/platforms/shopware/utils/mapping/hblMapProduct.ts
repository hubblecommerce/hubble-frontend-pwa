import { Product as SwProduct } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { PropertyGroup } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { HblProduct } from '@/utils/types'
import { hblMapMedia, hblMapManufacturer, hblMapPrice, hblMapProductMedia, hblMapVariantGroups } from '#imports'

export function hblMapProduct (swProduct: SwProduct, swProductConfigurator?: PropertyGroup[]): HblProduct {
    let firstUrl = null
    if (swProduct?.seoUrls != null) {
        // @ts-ignore
        firstUrl = swProduct.seoUrls[0]
    }

    let url = firstUrl?.pathInfo
    const pathInfo = firstUrl?.pathInfo
    if (firstUrl?.isCanonical) {
        url = firstUrl?.seoPathInfo
    }
    if (!url.startsWith('/')) {
        url = '/' + url
    }

    let media = null
    if (swProduct.media != null) {
        media = hblMapProductMedia(swProduct.media)
    } else if (swProduct.cover?.media != null) {
        media = hblMapMedia(swProduct.cover.media)
    }

    let variants = null
    if (swProductConfigurator != null && swProductConfigurator.length > 0) {
        variants = hblMapVariantGroups(swProductConfigurator)
    }

    let defaultOptions = null
    if (swProduct.optionIds != null) {
        defaultOptions = swProduct.optionIds
    }

    let parentId = null
    if (swProduct.parentId != null) {
        parentId = swProduct.parentId
    }

    // calculatedPrice = price configured on settings base page of product
    let price = swProduct.calculatedPrice != null ? hblMapPrice(swProduct.calculatedPrice) : null

    // calculatedPrices = price based on advanced price rules
    // is an array because you can have tier-prices (prices based on quantity)
    // @ts-ignore
    if (swProduct.calculatedPrices?.length > 0) {
        // @ts-ignore
        price = hblMapPrice(swProduct.calculatedPrices[0])
    }

    return {
        // @ts-ignore
        id: swProduct.id,
        name: swProduct.translated.name,
        description: swProduct.translated.description,
        sku: swProduct.productNumber,
        pathInfo,
        url,
        // @ts-ignore
        active: swProduct.available,
        stock: swProduct.stock,
        // @ts-ignore
        price,
        deliveryTime: swProduct.deliveryTime?.name,
        manufacturer: swProduct.manufacturer != null ? hblMapManufacturer(swProduct.manufacturer) : null,
        metaTitle: swProduct.translated.metaTitle,
        metaDescription: swProduct.translated.metaDescription,
        ...(variants != null && { variants }),
        ...(defaultOptions != null && { defaultOptions }),
        ...(parentId != null && { parentId }),
        ...(media != null && { media })
    }
}
