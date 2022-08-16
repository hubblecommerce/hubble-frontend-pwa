import { ref, Ref } from 'vue'
import { Navigation, IUseNavigation } from '@hubblecommerce/hubble/commons'
import { CategoryShopware, NavigationRouteResponse } from '@hubblecommerce/hubble/platforms/shopware/api-client'

function mapNavigation (swNavigation: NavigationRouteResponse): Navigation {
    return swNavigation.map((item) => {
        let children = []
        if (item.childCount > 0) {
            children = mapNavigation(item.children)
        }

        let url = null
        if (item.seoUrls.length > 0) {
            if (item.seoUrls[0].pathInfo !== undefined) {
                url = item.seoUrls[0].pathInfo
            }
        }

        return {
            id: item.id,
            name: item.name,
            url,
            children
        }
    })
}

const navigation: Ref<Navigation> = ref()

export const useNavigation = function (): IUseNavigation {
    const loading: Ref<boolean> = ref(false)
    const error: Ref<boolean> = ref(false)

    const getNavigation = async (): Promise<Navigation> => {
        loading.value = true
        error.value = false

        try {
            const response = await CategoryShopware.readNavigation(
                'main-navigation',
                'main-navigation',
                {},
                true
            )

            const mappedData = mapNavigation(response)

            navigation.value = mappedData

            loading.value = false
            return mappedData
        } catch (e) {
            loading.value = false
            error.value = e
            throw e
        }
    }

    return {
        navigation,
        getNavigation,
        loading,
        error
    }
}
