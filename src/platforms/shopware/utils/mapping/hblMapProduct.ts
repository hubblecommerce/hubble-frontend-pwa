import { Product as SwProduct, PropertyGroup } from '@hubblecommerce/hubble/platforms/shopware/api-client'
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
    let price = hblMapPrice(swProduct.calculatedPrice)

    if (swProduct.calculatedPrices != null && swProduct.calculatedPrices?.length > 0) {
        // @ts-ignore
        price = hblMapPrice(swProduct.calculatedPrices[swProduct.calculatedPrices.length - 1])
    }

    const variantsFrom = swProduct.calculatedCheapestPrice?.unitPrice !== swProduct.calculatedPrice?.unitPrice && swProduct.calculatedCheapestPrice?.variantId !== swProduct.id
    // Shopware needs to set variantListing data to extensions, not implemented yet
    // @ts-ignore
    const isParent = swProduct.extensions?.variantListing?.displayParent === true && parentId === null
    const priceRange = swProduct.calculatedPrices != null && (swProduct.calculatedPrices?.length > 0 || (isParent && variantsFrom))

    let cheapestPrice = null
    if (swProduct.calculatedCheapestPrice != null) {
        // @ts-ignore
        cheapestPrice = hblMapPrice(swProduct.calculatedCheapestPrice)
    }

    const tierPrices: any = []
    if (swProduct.calculatedPrices != null && swProduct.calculatedPrices?.length > 0) {
        swProduct.calculatedPrices?.map((price) => {
            return tierPrices.push({
                ...hblMapPrice(price),
                qty: price.quantity
            })
        })
    }

    return {
        // @ts-ignore
        id: swProduct.id,
        name: swProduct.translated?.name,
        description: swProduct.translated?.description,
        sku: swProduct.productNumber,
        pathInfo,
        url,
        // @ts-ignore
        active: swProduct.available,
        stock: swProduct.stock,
        priceRange,
        price,
        variantsFrom,
        // @ts-ignore
        cheapestPrice,
        tierPrices,
        deliveryTime: swProduct.deliveryTime?.name,
        manufacturer: swProduct.manufacturer != null ? hblMapManufacturer(swProduct.manufacturer) : null,
        metaTitle: swProduct.translated?.metaTitle,
        metaDescription: swProduct.translated?.metaDescription,
        ...(variants != null && { variants }),
        ...(defaultOptions != null && { defaultOptions }),
        ...(parentId != null && { parentId }),
        ...(media != null && { media })
    }
}
