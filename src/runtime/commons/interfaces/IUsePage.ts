import { Ref } from 'vue'
import { FetchResult } from '#app'
import { FetchRequest } from 'ohmyfetch'
import { Page } from './Page'

export interface IUsePage {
    loading: Ref<boolean>,
    error: Ref<boolean>
    getPage(path: string): Promise<Page>,
    page: Ref<Page>
}
