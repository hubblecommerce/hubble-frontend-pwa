import { type Product as SwProduct, type PropertyGroup } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { type HblProduct } from '@/utils/types'
import {
    hblMapMedia,
    hblMediaIncludes,
    hblMapManufacturer,
    hblManufacturerIncludes,
    hblMapPrice,
    hblPriceIncludes,
    hblMapProductMedia,
    hblProductMediaIncludes,
    hblMapVariantGroups,
    hblVariantGroupsIncludes,
} from '#imports'

export const hblProductIncludes = {
    'product': [
        'id',
        'translated',
        'name',
        'description',
        'productNumber',
        'seoUrls',
        'available',
        'stock',
        'calculatedCheapestPrice',
        'calculatedPrices',
        'calculatedPrice',
        'variantListingConfig',
        'parentId',
        'deliveryTime',
        'manufacturer',
        'metaTitle',
        'metaDescription',
        'configurator',
        'optionIds',
        'media',
        'cover',
    ],
    'calculated_cheapest_price': [
        'unitPrice',
        'variantId',
        'listPrice',
        'calculatedTaxes'
    ],
    'seo_url': [
        'pathInfo',
        'isCanonical',
        'seoPathInfo'
    ],
    'delivery_time': [
        'name',
        'translated'
    ],
    ...hblProductMediaIncludes,
    ...hblMediaIncludes,
    ...hblVariantGroupsIncludes,
    ...hblPriceIncludes,
    ...hblManufacturerIncludes
}

export function hblMapProduct (swProduct: SwProduct, swProductConfigurator?: PropertyGroup[]): HblProduct {
    let firstUrl = null
    if (swProduct?.seoUrls != null) {
        firstUrl = swProduct.seoUrls[0]
    }

    let url = firstUrl?.pathInfo
    const pathInfo = url
    if (firstUrl?.isCanonical) {
        url = firstUrl?.seoPathInfo
    }
    if (!url?.startsWith('/')) {
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

    const _cheapest = swProduct?.calculatedCheapestPrice

    const _real = swProduct?.calculatedPrices != null && swProduct?.calculatedPrices?.length > 0
        ? swProduct?.calculatedPrices[0]
        : swProduct?.calculatedPrice

    // @TODO: platform need to provide cheapestPrice
    const _displayParent = swProduct?.variantListingConfig?.displayParent && swProduct?.parentId === null

    const displayFromVariants = !!swProduct?.parentId &&
        // @ts-ignore
        swProduct?.cheapestPrice?.hasRange &&
        // @ts-ignore
        !!swProduct?.cheapestPrice?.parentId &&
        // @ts-ignore
        _real?.unitPrice !== _cheapest?.unitPrice &&
        // @ts-ignore
        _cheapest?.unitPrice

    const displayFrom = swProduct?.calculatedPrices != null && (swProduct?.calculatedPrices?.length > 1 || !!(_displayParent && displayFromVariants))

    const _price = () => {
        if (displayFrom && swProduct?.calculatedPrices != null && swProduct?.calculatedPrices?.length > 1) {
            const lowest = swProduct?.calculatedPrices?.reduce(
                (previous, current) => {
                    return current.unitPrice < previous.unitPrice ? current : previous
                }
            )
            return lowest || _cheapest
        }
        return _real
    }

    const price = hblMapPrice(_price())

    const variantsFrom = displayFromVariants

    const priceRange = displayFrom

    let cheapestPrice = null
    if (swProduct.calculatedCheapestPrice != null) {
        // @ts-ignore
        cheapestPrice = hblMapPrice(_cheapest)
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
        deliveryTime: swProduct.deliveryTime?.translated?.name,
        manufacturer: swProduct.manufacturer != null ? hblMapManufacturer(swProduct.manufacturer) : null,
        metaTitle: swProduct.translated?.metaTitle,
        metaDescription: swProduct.translated?.metaDescription,
        pathInfo,
        ...(variants != null && { variants }),
        ...(defaultOptions != null && { defaultOptions }),
        ...(parentId != null && { parentId }),
        ...(media != null && { media })
    }
}
