import { type OrderLineItem as SwOrderLineItem } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { type HblOrderLineItem } from '@/utils/types'
import { hblMapOrderLineItem } from '#imports'

export function hblMapOrderLineItems (swOrderLineItem: SwOrderLineItem[]): HblOrderLineItem[] {
    return swOrderLineItem.map((item) => {
        return hblMapOrderLineItem(item)
    })
}
