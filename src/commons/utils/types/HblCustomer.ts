import { Ref } from 'vue'

export interface HblCustomerShippingAddress {
    id: string,
    salutation: string,
    firstName: string,
    lastName: string,
    company?: string,
    street: string,
    zipcode: string,
    city: string,
    country: string,
    phone?: string,
}

export interface HblCustomerBillingAddress {
    id: string,
    salutation: string,
    firstName: string,
    lastName: string,
    company?: string,
    street: string,
    zipcode: string,
    city: string,
    country: string,
    phone?: string,
}

export interface HblRegisterCustomerForm {
    email: string,
    createAccount: boolean,
    dateOfBirth?: string,
    password?: string,
    shippingAddress: Ref<HblCustomerShippingAddress>,
    billingAddress: Ref<HblCustomerBillingAddress>,
    billingSameAsShipping: boolean
}

export interface HblCustomer {
    name: string,
    email: string,
    isGuest: boolean,
    shippingAddress?: HblCustomerShippingAddress
    billingAddress?: HblCustomerBillingAddress,
    billingSameAsShipping?: boolean,
    salutationId?: string,
    firstName?: string,
    lastName?: string,
    dateOfBirth?: string | null,
    newsletter?: boolean,
    defaultPayment?: string
}
