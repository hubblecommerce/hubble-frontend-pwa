import { Order as SwOrder } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { Order } from '@hubblecommerce/hubble/commons'
import { hblMapOrder } from '#imports'

export function hblMapOrders (swOrders: SwOrder[]): Order[] {
    return swOrders.map((order) => {
        return hblMapOrder(order)
    })
}
