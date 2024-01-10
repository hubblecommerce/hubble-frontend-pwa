import { type Ref } from 'vue'
import { type HblCustomer, type HblCustomerBillingAddress, type HblCustomerShippingAddress, type HblRegisterCustomerForm } from '@/utils/types/HblCustomer'
import { type HblOrder } from '@/utils/types/HblOrder'

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
    getOrderLineItemDownload (orderId: string, downloadId: string): Promise<Blob | void>,
    getOrderDocumentDownload (orderId: string, downloadId: string): Promise<any>,
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
