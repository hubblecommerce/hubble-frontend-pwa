import { ComputedRef, Ref } from 'vue'
import { Customer } from './Customer'

export interface IUseCustomer {
    customer: Ref<Customer>,
    loading: Ref<boolean>,
    error: Ref<boolean>,
    getCustomer(): Promise<Customer>,
    isGuest: ComputedRef<boolean>,
    login(username: string, password: string): Promise<string>
}
