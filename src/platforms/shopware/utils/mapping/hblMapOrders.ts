import { type Order as SwOrder } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { type HblOrder } from '@/utils/types'
import { hblMapOrder } from '#imports'

export function hblMapOrders (swOrders: SwOrder[]): HblOrder[] {
    return swOrders.map((order) => {
        return hblMapOrder(order)
    })
}
