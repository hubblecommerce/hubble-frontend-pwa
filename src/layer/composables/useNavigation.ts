import { ref, type Ref } from 'vue'
import { CategoryShopware } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { type HblNavigation, type HblIUseNavigation } from '../types'
import { hblMapNavigation } from '#imports'

const navigation: Ref<HblNavigation | null> = ref(null)

export const useNavigation = function (): HblIUseNavigation {
    const loading: Ref<boolean> = ref(false)
    const error: Ref = ref(false)

    const getNavigation = async (): Promise<HblNavigation | void> => {
        loading.value = true
        error.value = false

        try {
            const response = await CategoryShopware.readNavigation(
                'main-navigation',
                'main-navigation',
                {}
            )

            const mappedData = hblMapNavigation(response)

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
