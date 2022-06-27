import { Ref } from 'vue'
import { Page } from './Page'

export interface IUsePage {
    loading: Ref<boolean>,
    error: Ref<boolean>
    getPage(path: string): Promise<Page>,
    page: Ref<Page>
}
