import { ComputedRef, Ref } from 'vue'
import { Customer, CustomerBillingAddress, CustomerShippingAddress, RegisterCustomerForm } from './Customer'
import { Order } from './Order'

export interface IUseCustomer {
    customer: Ref<Customer | null>,
    loading: Ref<boolean>,
    error: Ref,
    getCustomer(): Promise<Customer>,
    login(username: string, password: string): Promise<string>,
    logout(): void,
    updateShippingAddress (shippingAddress: CustomerShippingAddress): Promise<CustomerShippingAddress | void>,
    updateBillingAddress (billingAddress: CustomerBillingAddress): Promise<CustomerBillingAddress | void>,
    register(formData: RegisterCustomerForm): Promise<Customer | void>,
    getCustomerAddresses (): Promise<CustomerBillingAddress[] | CustomerShippingAddress[]>,
    addCustomerAddress (address: CustomerBillingAddress | CustomerShippingAddress): Promise<CustomerBillingAddress | CustomerShippingAddress | void>,
    updateCustomerAddress (address: CustomerBillingAddress | CustomerShippingAddress): Promise<CustomerBillingAddress | CustomerShippingAddress | void>,
    deleteCustomerAddress (addressId: string): Promise<void>,
    getOrders (id?: string): Promise<Order | Order[]>,
    setDefaultBilling (id: string): Promise<void>,
    setDefaultShipping (id: string): Promise<void>,
    requireNewPassword (email: string): Promise<void>,
    setNewPassword (hash: string, password: string, passwordRepeat: string): Promise<void>,
    editCustomerInfo (formData: { dateOfBirth: string | null, salutationId: string, firstName: string, lastName: string }): Promise<void>,
    editCustomerEmail (formData: { email: string, emailConfirmation: string, password: string }): Promise<void>,
    editCustomerPassword (formData: { password: string, newPassword: string, newPasswordConfirm: string }): Promise<void>,
    editCustomerNewsletter (formData: { email: string, option: string, storefrontUrl: string }): Promise<void>,
}
