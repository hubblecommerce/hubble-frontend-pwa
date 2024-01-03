import { type Ref } from 'vue'
import { type HblNavigation } from '@/utils/types/HblNavigation'

export interface HblIUseNavigation {
    loading: Ref<boolean>,
    error: Ref,
    navigation: Ref<HblNavigation>,
    getNavigation(): Promise<HblNavigation | void>
}
