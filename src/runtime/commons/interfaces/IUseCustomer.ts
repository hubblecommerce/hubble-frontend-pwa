import { ComputedRef, Ref } from 'vue'
import { Customer, CustomerBillingAddress, CustomerShippingAddress, RegisterCustomerForm } from './Customer'
import { Order } from './Order'

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
    addCustomerAddress (address: CustomerBillingAddress | CustomerShippingAddress): Promise<CustomerBillingAddress | CustomerShippingAddress>,
    updateCustomerAddress (address: CustomerBillingAddress | CustomerShippingAddress): Promise<CustomerBillingAddress | CustomerShippingAddress>,
    deleteCustomerAddress (addressId: string): Promise<void>,
    getOrders (id?: string): Promise<Order | Order[]>,
    setDefaultBilling (id: string): Promise<void>,
    setDefaultShipping (id: string): Promise<void>
}
