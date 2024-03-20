import { type NavigationRouteResponse } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { type HblNavigation } from '@/utils/types'

export function hblMapNavigation (swNavigation: NavigationRouteResponse): HblNavigation {
    // @ts-ignore
    return swNavigation.map((item) => {
        let children: HblNavigation = []
        if (item.childCount != null && item.childCount > 0) {
            // @ts-ignore
            children = hblMapNavigation(item.children)
        }

        let url = null
        if (item.seoUrls != null && item.seoUrls?.length > 0) {
            if (item.seoUrls[0].seoPathInfo !== undefined) {
                url = '/' + item.seoUrls[0].seoPathInfo
            }
        } else {
            url = `/navigation/${item.id}`
        }

        return {
            id: item.id,
            name: item?.translated?.name,
            url,
            children
        }
    })
}
