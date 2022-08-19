import { Ref } from 'vue'

export interface CustomerShippingAddress {
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

export interface CustomerBillingAddress {
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

export interface RegisterCustomerForm {
    email: string,
    createAccount: boolean,
    password?: string,
    shippingAddress: Ref<CustomerShippingAddress>,
    billingAddress: Ref<CustomerBillingAddress>,
    billingSameAsShipping: boolean
}

export interface Customer {
    name: string,
    email: string,
    isGuest: boolean,
    shippingAddress?: CustomerShippingAddress
    billingAddress?: CustomerBillingAddress,
    billingSameAsShipping?: boolean
}
