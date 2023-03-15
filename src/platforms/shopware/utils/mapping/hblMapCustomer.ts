import { SalesChannelContext } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { Customer } from '@hubblecommerce/hubble/commons'
import { hblMapCustomerAddress } from '#imports'

export function hblMapCustomer (customer: SalesChannelContext['customer']): Customer {
    const obj: Customer = {
        // @ts-ignore
        salutationId: customer.salutationId,
        // @ts-ignore
        name: `${customer.firstName} ${customer.lastName}`,
        // @ts-ignore
        firstName: customer.firstName,
        // @ts-ignore
        lastName: customer.lastName,
        // @ts-ignore
        dateOfBirth: customer.birthday,
        // @ts-ignore
        email: customer.email,
        // @ts-ignore
        isGuest: customer.guest,
        // @ts-ignore
        newsletter: customer.newsletter,
        // @ts-ignore
        defaultPayment: customer.defaultPaymentMethodId
    }

    // Todo patch api client
    // @ts-ignore
    if (customer.activeShippingAddress != null) {
        // Todo patch api client
        // @ts-ignore
        Object.assign(obj, { shippingAddress: hblMapCustomerAddress(customer.activeShippingAddress) })
    }

    // Todo patch api client
    // @ts-ignore
    if (customer.activeBillingAddress != null) {
        // Todo patch api client
        // @ts-ignore
        Object.assign(obj, { billingAddress: hblMapCustomerAddress(customer.activeBillingAddress) })
    }

    /*
     * Remove id and compare mapped shipping and billing address to tell if they are the same or not
     */
    if (obj.shippingAddress != null && obj.billingAddress != null) {
        const { id: shippingId, ...cleanedShippingAddress } = obj.shippingAddress
        const { id: billingId, ...cleanedBillingAddress } = obj.billingAddress
        obj.billingSameAsShipping = JSON.stringify(cleanedShippingAddress) === JSON.stringify(cleanedBillingAddress)
    }

    return obj
}
