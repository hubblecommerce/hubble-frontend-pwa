import { Ref, ref } from 'vue'
import {
    IUsePage,
    Page,
    ProductListing,
    ProductListingFilterCurrent,
    useDefaultStructure
} from '@hubblecommerce/hubble/commons'
import {
    ProductListingCriteria, ProductListingFlags,
    ProductShopware,
    PwaShopware
} from '@hubblecommerce/hubble/platforms/shopware/api-client'
import {
    includes,
    associations,
    mapPage,
    mapProductListing
} from '@hubblecommerce/hubble/platforms/shopware/api-client/utils'

export const usePage = function (): IUsePage {
    const loading: Ref<boolean> = ref(false)
    const error: Ref<boolean> = ref(false)
    const page: Ref<Page> = ref(null)

    const getPage = async (path: string): Promise<Page> => {
        try {
            loading.value = true
            error.value = false

            const response = await PwaShopware.pwaResolvePage(
                {
                    path,
                    includes,
                    associations
                }
            )

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

    async function getProductListing (filters: ProductListingFilterCurrent, limit: number, sort: string, page?: number): Promise<ProductListing> {
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

            const requestBody = {
                includes,
                associations,
                order: sort,
                limit,
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

            const response = await ProductShopware.readProductListing(
                navigationId as string,
                'application/json',
                'application/json',
                // TODO Patch api
                // @ts-ignore
                requestBody
            )

            const mappedListing = mapProductListing(response)

            loading.value = false
            return mappedListing
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
        page,
        getProductListing
    }
}
