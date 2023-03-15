import { CustomerBillingAddress, CustomerShippingAddress } from '@hubblecommerce/hubble/commons'
import { CustomerAddress as SwCustomerAddress } from '@hubblecommerce/hubble/platforms/shopware/api-client'

export function swMapCustomerAddress (address: CustomerShippingAddress | CustomerBillingAddress): SwCustomerAddress {
    return {
        createdAt: '',
        customerId: '',
        salutationId: address.salutation,
        firstName: address.firstName,
        lastName: address.lastName,
        street: address.street,
        zipcode: address.zipcode,
        city: address.city,
        countryId: address.country,
        ...(address.company != null && { company: address.company }),
        ...(address.phone != null && { phone: address.phone })
    }
}
