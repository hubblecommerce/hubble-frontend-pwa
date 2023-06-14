import { Ref } from 'vue'
import { HblNavigation } from '@/utils/types/HblNavigation'

export interface HblIUseNavigation {
    loading: Ref<boolean>,
    error: Ref,
    navigation: Ref<HblNavigation>,
    getNavigation(): Promise<HblNavigation | void>
}
