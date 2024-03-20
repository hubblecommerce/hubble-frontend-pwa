import { type Ref, ref } from 'vue'
import { type RouteLocationNormalizedLoaded } from 'vue-router'
import { joinURL } from 'ufo'
import { getRequestURL as h3GetRequestUrl } from 'h3'
import {
    ProductShopware,
    PwaShopware,
    OpenAPI,
    type PropertyGroup,
    type Product as swProduct
} from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { request as __request } from '@hubblecommerce/hubble/platforms/shopware/request'
import { useLocalisation, hblMapPage, hblMapProductListing, hblMapProduct, useRequestEvent, useRouter, useRuntimeConfig } from '#imports'
import {
    type HblIUsePage,
    type HblPage,
    type HblProduct,
    type HblProductListing,
    type HblProductListingFilterCurrent
} from '@/utils/types'
import { hblUseDefaultStructure } from '@/utils/helper'

const associations = {
    media: {},
    manufacturer: {
        associations: {
            media: {}
        }
    }
}

export function getRequestURL () {
    if (process.server) {
        const url: any = h3GetRequestUrl(useRequestEvent())
        url.pathname = joinURL(useRuntimeConfig().app.baseURL, url.pathname)
        return url
    }
    return new URL(window.location.href)
}

export const usePage = function (): HblIUsePage {
    const loading: Ref<boolean> = ref(false)
    const error: Ref = ref(false)
    const page: Ref<HblPage | null> = ref(null)
    const { currentRoute } = useRouter()
    const { isLocalisedRoute } = useLocalisation()

    const getPage = async (route: RouteLocationNormalizedLoaded): Promise<HblPage> => {
        try {
            loading.value = true
            error.value = false

            let path = route.path
            const params = parseParamsFromQuery(route)

            // Remove localisation from route
            const routeLocale = isLocalisedRoute(path)
            if (routeLocale) {
                path = path.replace('/' + routeLocale, '')
            }

            const requestBody = {
                associations,
                path,
                ...params
            }

            const response = await PwaShopware.pwaResolvePage(requestBody)

            const mappedPage = hblMapPage(response)

            if (mappedPage.structure === null) {
                const { setDefaultStructures, getDefaultStructureByType } = hblUseDefaultStructure()
                setDefaultStructures()
                mappedPage.structure = getDefaultStructureByType(mappedPage.type)
            }

            loading.value = false
            return mappedPage
        } catch (e) {
            loading.value = false
            error.value = e
            throw e
        }
    }

    async function getProductListing (filters: HblProductListingFilterCurrent, limit: number, sort: string, page?: number): Promise<{ productListing: HblProductListing, params: Record<string, unknown> }> {
        try {
            loading.value = true
            error.value = false

            const { navigationId, search, manufacturer, price, rating, 'shipping-free': shipping, ...properties } = filters

            const cleanedProps: any[] = []
            Object.keys(properties).forEach((key) => {
                // @ts-ignore
                properties[key].forEach((property) => {
                    if (property !== '') {
                        cleanedProps.push(property)
                    }
                })
            })

            const params = {
                order: sort,
                limit,
                ...(search != null && { search }),
                ...(page != null && { p: page }),
                // @ts-ignore
                ...(manufacturer?.length > 0 && { manufacturer: manufacturer.join('|') }),
                // @ts-ignore
                ...(price?.min !== '' && { 'min-price': price.min }),
                // @ts-ignore
                ...(price?.max !== '' && { 'max-price': price.max }),
                // @ts-ignore
                ...(rating?.min !== '' && { rating: rating.min }),
                ...(shipping != null && { 'shipping-free': shipping }),
                ...(cleanedProps.length > 0 && { properties: cleanedProps.join('|') })
            }

            const requestBody = {
                associations,
                ...params
            }

            let response

            if (navigationId) {
                response = await ProductShopware.readProductListing(
                    navigationId as string,
                    // TODO Patch api
                    // @ts-ignore
                    requestBody
                )
            } else {
                response = await ProductShopware.searchPage(
                    // TODO Patch api
                    // @ts-ignore
                    requestBody
                )
            }

            const mappedListing = hblMapProductListing(response)

            loading.value = false
            return { productListing: mappedListing, params }
        } catch (e) {
            loading.value = false
            error.value = e
            throw e
        }
    }

    // Write parameters to current url without reloading the page
    function updateUri (params: any): void {
        const url = new URL(getRequestURL().origin + currentRoute.value.path)
        url.search = new URLSearchParams(params).toString()
        window.history.pushState(
            {},
            '',
            url.href
        )
    }

    async function getProductVariant (parentId: string, selectedOptions: Record<string, string>, switchedOption: string, switchedGroup: string): Promise<HblProduct | void> {
        loading.value = true
        error.value = false

        try {
            const options: any = {}
            Object.keys(selectedOptions).map((key) => {
                options[selectedOptions[key]] = selectedOptions[key]
            })

            const matchingVariant = await ProductShopware.searchProductVariantIds(parentId, {
                options,
                switchedGroup
            })

            // @ts-ignore
            if (matchingVariant?.variantId == null) {
                loading.value = false
                // @ts-ignore
                error.value = 'No matching variant found'
                return
            }

            const response = await __request(OpenAPI, {
                method: 'POST',
                url: '/product/{productId}',
                path: {
                    // @ts-ignore
                    productId: matchingVariant?.variantId
                },
                body: {
                    associations: {
                        ...associations,
                        crossSellings: {}
                    }
                }
            }) as { product: swProduct, configurator: Array<PropertyGroup> }

            if (response.product == null) {
                loading.value = false
                // @ts-ignore
                error.value = 'No matching variant found'
                return
            }

            loading.value = false
            return hblMapProduct(response.product, response.configurator)
        } catch (e) {
            loading.value = false
            error.value = e
        }
    }

    function parseParamsFromQuery (route: RouteLocationNormalizedLoaded): any {
        const {
            order,
            limit,
            p,
            manufacturer,
            'min-price': minPrice,
            'max-price': maxPrice,
            rating,
            'shipping-free': shipping,
            properties,
            search,
            ...unknown
        } = route.query

        return {
            ...(order != null && { order }),
            ...(limit != null && typeof limit === 'string' && { limit: parseInt(limit) }),
            ...(p != null && { p }),
            ...(manufacturer != null && typeof manufacturer === 'string' && { manufacturer }),
            ...(minPrice != null && { 'min-price': minPrice }),
            ...(maxPrice != null && { 'max-price': maxPrice }),
            ...(rating != null && { rating }),
            ...(shipping != null && { 'shipping-free': (shipping === 'true') }),
            ...(properties != null && typeof properties === 'string' && { properties }),
            ...(search != null && { search })
        }
    }

    return {
        loading,
        error,
        getPage,
        page,
        getProductListing,
        updateUri,
        getProductVariant,
        parseParamsFromQuery
    }
}
