import { ComputedRef, Ref } from 'vue'
import { FetchResult } from '#app'
import { FetchRequest } from 'ohmyfetch'
import { Customer, CustomerBillingAddress, CustomerShippingAddress, RegisterCustomerForm } from './Customer'
import { CustomerAddress } from '@hubblecommerce/hubble/platforms/shopware/api-client'

export interface IUseCustomer {
    customer: Ref<Customer>,
    loading: Ref<boolean>,
    error: Ref<boolean | string>,
    getCustomer(): Promise<Customer>,
    isGuest: ComputedRef<boolean>,
    login(username: string, password: string): Promise<string>,
    logout(): void,
    updateShippingAddress (shippingAddress: CustomerShippingAddress): Promise<CustomerShippingAddress>,
    updateBillingAddress (billingAddress: CustomerBillingAddress): Promise<CustomerBillingAddress>,
    register(formData: RegisterCustomerForm): Promise<Customer>,
    getCustomerAddresses (): Promise<CustomerBillingAddress[] | CustomerShippingAddress[]>,
    addCustomerAddress (address: CustomerBillingAddress | CustomerShippingAddress): Promise<void>,
    updateCustomerAddress (address: CustomerBillingAddress | CustomerShippingAddress): Promise<CustomerBillingAddress | CustomerShippingAddress>,
    deleteCustomerAddress (addressId: string): Promise<void>
}
