import { ref, Ref } from 'vue'
import { Navigation, IUseNavigation } from '@hubblecommerce/hubble/commons'
import { CategoryShopware } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { mapNavigation } from '@hubblecommerce/hubble/platforms/shopware/api-client/utils'

const navigation: Ref<Navigation> = ref(null)

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
                {}
            )

            const mappedData = mapNavigation(response)

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
