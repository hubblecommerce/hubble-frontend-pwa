import { type HblCustomerBillingAddress, type HblCustomerShippingAddress } from '@/utils/types'
import { type CustomerAddress as SwCustomerAddress } from '@hubblecommerce/hubble/platforms/shopware/api-client'

export function swMapCustomerAddress (address: HblCustomerShippingAddress | HblCustomerBillingAddress): SwCustomerAddress {
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
