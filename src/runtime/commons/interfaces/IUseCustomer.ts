import { ComputedRef, Ref } from 'vue'
import { FetchResult } from '#app'
import { FetchRequest } from 'ohmyfetch'
import { Customer, CustomerBillingAddress, CustomerShippingAddress, RegisterCustomerForm } from './Customer'
import { CustomerAddress } from '@hubblecommerce/hubble/platforms/shopware/api-client'

export interface IUseCustomer {
    customer: Ref<Customer>,
    loading: Ref<boolean>,
    error: Ref<boolean>,
    getCustomer(): Promise<Customer>,
    isGuest: ComputedRef<boolean>,
    login(username: string, password: string): Promise<string>,
    logout(): void,
    updateShippingAddress(shippingAddress: CustomerShippingAddress): Promise<CustomerAddress>,
    updateBillingAddress (billingAddress: CustomerBillingAddress): Promise<CustomerAddress>,
    register(formData: RegisterCustomerForm): Promise<Customer>
}
