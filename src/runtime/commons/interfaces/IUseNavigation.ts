import { Ref } from 'vue'
import { Navigation } from './Navigation'

export interface IUseNavigation {
    loading: Ref<boolean>,
    error: Ref,
    navigation: Ref<Navigation>,
    getNavigation(): Promise<Navigation | void>
}
