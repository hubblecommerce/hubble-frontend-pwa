import { Ref, ref } from 'vue'
import { RouteLocationNormalizedLoaded } from 'vue-router'
import { useRouter } from '#app'
import {
    IUsePage,
    Page, Product,
    ProductListing,
    ProductListingFilterCurrent,
    useDefaultStructure
} from '@hubblecommerce/hubble/commons'
import {
    ProductShopware,
    PwaShopware
} from '@hubblecommerce/hubble/platforms/shopware/api-client'
import {
    mapPage,
    mapProductListing, mapProduct
} from '@hubblecommerce/hubble/platforms/shopware/api-client/utils'
import { useLocalisation, useRuntimeConfig } from '#imports'

const associations = {
    media: {},
    manufacturer: {
        associations: {
            media: {}
        }
    }
}

export const usePage = function (): IUsePage {
    const loading: Ref<boolean> = ref(false)
    const error: Ref<boolean> = ref(false)
    const page: Ref<Page> = ref(null)
    const runtimeConfig = useRuntimeConfig()
    const { currentRoute } = useRouter()
    const { isLocalisedRoute } = useLocalisation()

    const getPage = async (route: RouteLocationNormalizedLoaded): Promise<Page> => {
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

            const mappedPage = mapPage(response)

            if (mappedPage.structure === null) {
                const { setDefaultStructures, getDefaultStructureByType } = useDefaultStructure()
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

    async function getProductListing (filters: ProductListingFilterCurrent, limit: number, sort: string, page?: number): Promise<{ productListing: ProductListing, params: Record<string, unknown> }> {
        try {
            loading.value = true
            error.value = false

            const { navigationId, search, manufacturer, price, rating, 'shipping-free': shipping, ...properties } = filters

            const cleanedProps = []
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
                ...(manufacturer?.length > 0 && { manufacturer }),
                // @ts-ignore
                ...(price?.min !== '' && { 'min-price': price.min }),
                // @ts-ignore
                ...(price?.max !== '' && { 'max-price': price.max }),
                // @ts-ignore
                ...(rating?.min !== '' && { rating: rating.min }),
                ...(shipping != null && { 'shipping-free': shipping }),
                ...(cleanedProps.length > 0 && { properties: cleanedProps })
            }

            const requestBody = {
                associations,
                ...params
            }

            let response

            if (navigationId) {
                response = await ProductShopware.readProductListing(
                    navigationId as string,
                    'application/json',
                    'application/json',
                    // TODO Patch api
                    // @ts-ignore
                    requestBody
                )
            } else {
                response = await ProductShopware.searchPage(
                    'application/json',
                    'application/json',
                    // TODO Patch api
                    // @ts-ignore
                    requestBody
                )
            }

            const mappedListing = mapProductListing(response)

            loading.value = false
            return { productListing: mappedListing, params }
        } catch (e) {
            loading.value = false
            error.value = e
            throw e
        }
    }

    // Write parameters to current url without reloading the page
    function updateUri (params): void {
        const url = new URL(runtimeConfig.public.appBaseUrl + currentRoute.value.path)
        url.search = new URLSearchParams(params).toString()
        window.history.pushState(
            {},
            null,
            url.href
        )
    }

    async function getProductVariant (parentId: string, selectedOptions: Record<string, string>): Promise<Product> {
        loading.value = true
        error.value = false

        try {
            const queries = []
            Object.keys(selectedOptions).forEach((key) => {
                queries.push({
                    type: 'contains',
                    field: 'optionIds',
                    value: selectedOptions[key]
                })
            })

            const filter = [
                {
                    type: 'equals',
                    field: 'parentId',
                    value: parentId
                },
                {
                    type: 'multi',
                    operator: 'and',
                    queries
                }
            ]

            const response = await ProductShopware.readProduct(
                'application/json',
                'application/json',
                {
                    associations,
                    // Todo patch api
                    // @ts-ignore
                    filter
                }
            )

            if (response.elements.length !== 1) {
                loading.value = false
                return
            }

            loading.value = false
            return mapProduct(response.elements[0])
        } catch (e) {
            loading.value = false
            error.value = e
            return e
        }
    }

    function parseParamsFromQuery (route) {
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
            ...(manufacturer != null && typeof manufacturer === 'string' && { manufacturer: manufacturer.split(',') }),
            ...(minPrice != null && { 'min-price': minPrice }),
            ...(maxPrice != null && { 'max-price': maxPrice }),
            ...(rating != null && { rating }),
            ...(shipping != null && { 'shipping-free': (shipping === 'true') }),
            ...(properties != null && typeof properties === 'string' && { properties: properties.split(',') }),
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
