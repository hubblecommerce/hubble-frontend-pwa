import { type CustomerAddress as SwCustomerAddress, type OrderAddress } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { type HblCustomerBillingAddress, type HblCustomerShippingAddress } from '@/utils/types'

export function hblMapCustomerAddress (swAddress: SwCustomerAddress | OrderAddress): HblCustomerShippingAddress | HblCustomerBillingAddress {
    let salutationId
    // @ts-ignore
    if (swAddress.salutationId != null) {
        // @ts-ignore
        salutationId = swAddress.salutationId
    } else {
        salutationId = swAddress.salutation?.id
    }

    return {
        id: swAddress.id,
        salutation: salutationId,
        firstName: swAddress.firstName,
        lastName: swAddress.lastName,
        ...(swAddress.company != null && { company: swAddress.company }),
        street: swAddress.street,
        zipcode: swAddress.zipcode != null ? swAddress.zipcode : '',
        city: swAddress.city,
        country: swAddress.countryId,
        ...(swAddress.phoneNumber != null && { phone: swAddress.phoneNumber })
    }
}
