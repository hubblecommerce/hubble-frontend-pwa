import { type CustomerAddress as SwCustomerAddress } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { type HblCustomerBillingAddress, type HblCustomerShippingAddress } from '../../types'
import { hblMapCustomerAddress } from '#imports'

export function hblMapCustomerAddresses (swAddresses: SwCustomerAddress[]): HblCustomerShippingAddress[] | HblCustomerBillingAddress[] {
    return swAddresses.map((swAddress) => {
        return hblMapCustomerAddress(swAddress)
    })
}
