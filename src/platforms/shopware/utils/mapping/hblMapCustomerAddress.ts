import { CustomerAddress as SwCustomerAddress, OrderAddress } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { CustomerBillingAddress, CustomerShippingAddress } from '@hubblecommerce/hubble/commons'

export function hblMapCustomerAddress (swAddress: SwCustomerAddress | OrderAddress): CustomerShippingAddress | CustomerBillingAddress {
    let salutationId
    // @ts-ignore
    if (swAddress.salutationId != null) {
        // @ts-ignore
        salutationId = swAddress.salutationId
    } else {
        salutationId = swAddress.salutation?.id
    }

    return {
        // @ts-ignore
        id: swAddress.id,
        salutation: salutationId,
        firstName: swAddress.firstName,
        lastName: swAddress.lastName,
        ...(swAddress.company != null && { company: swAddress.company }),
        street: swAddress.street,
        zipcode: swAddress.zipcode,
        city: swAddress.city,
        country: swAddress.countryId,
        ...(swAddress.phoneNumber != null && { phone: swAddress.phoneNumber })
    }
}
