import { ComputedRef, Ref } from 'vue'
import { FetchResult } from '#app'
import { FetchRequest } from 'ohmyfetch'
import { Customer } from './Customer'

export interface IUseCustomer {
    customer: Ref<Customer>,
    loading: Ref<boolean>,
    error: Ref<boolean>,
    getCustomer(): Promise<FetchResult<FetchRequest>>,
    isGuest: ComputedRef<boolean>,
    login(username: string, password: string): Promise<string>,
    logout(): void
}
