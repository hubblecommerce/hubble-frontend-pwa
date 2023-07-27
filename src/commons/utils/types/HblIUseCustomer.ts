import { Ref } from 'vue'
import { HblCustomer, HblCustomerBillingAddress, HblCustomerShippingAddress, HblRegisterCustomerForm } from '@/utils/types/HblCustomer'
import { HblOrder } from '@/utils/types/HblOrder'

export interface HblIUseCustomer {
    customer: Ref<HblCustomer | null>,
    loading: Ref<boolean>,
    error: Ref,
    getCustomer(): Promise<HblCustomer>,
    login(username: string, password: string): Promise<string>,
    logout(): void,
    updateShippingAddress (shippingAddress: HblCustomerShippingAddress): Promise<HblCustomerShippingAddress | void>,
    updateBillingAddress (billingAddress: HblCustomerBillingAddress): Promise<HblCustomerBillingAddress | void>,
    register(formData: HblRegisterCustomerForm): Promise<HblCustomer | void>,
    registerConfirm (formData: { em: string, hash: string }): Promise<void>,
    getCustomerAddresses (): Promise<HblCustomerBillingAddress[] | HblCustomerShippingAddress[]>,
    addCustomerAddress (address: HblCustomerBillingAddress | HblCustomerShippingAddress): Promise<HblCustomerBillingAddress | HblCustomerShippingAddress | void>,
    updateCustomerAddress (address: HblCustomerBillingAddress | HblCustomerShippingAddress): Promise<HblCustomerBillingAddress | HblCustomerShippingAddress | void>,
    deleteCustomerAddress (addressId: string): Promise<void>,
    getOrders (params?: { id?: string, page?: number }): Promise<{ data: HblOrder | HblOrder[], total: number, page: number, limit: number }>,
    setDefaultBilling (id: string): Promise<void>,
    setDefaultShipping (id: string): Promise<void>,
    requireNewPassword (email: string): Promise<void>,
    setNewPassword (hash: string, password: string, passwordRepeat: string): Promise<void>,
    editCustomerInfo (formData: { dateOfBirth: string | null, salutationId: string, firstName: string, lastName: string }): Promise<void>,
    editCustomerEmail (formData: { email: string, emailConfirmation: string, password: string }): Promise<void>,
    editCustomerPassword (formData: { password: string, newPassword: string, newPasswordConfirm: string }): Promise<void>,
    editCustomerNewsletter (formData: { email: string, option: string, storefrontUrl: string }): Promise<void>,
    confirmCustomerNewsletter (formData: { em: string, hash: string }): Promise<void>,
    editCustomerPayment (paymentId: string): Promise<void>
}
