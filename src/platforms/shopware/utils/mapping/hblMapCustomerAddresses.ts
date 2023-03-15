import { CustomerAddress as SwCustomerAddress } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { CustomerBillingAddress, CustomerShippingAddress } from '@hubblecommerce/hubble/commons'
import { hblMapCustomerAddress } from '#imports'

export function hblMapCustomerAddresses (swAddresses: SwCustomerAddress[]): CustomerShippingAddress[] | CustomerBillingAddress[] {
    return swAddresses.map((swAddress) => {
        return hblMapCustomerAddress(swAddress)
    })
}
