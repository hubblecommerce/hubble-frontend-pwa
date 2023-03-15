import { OrderLineItem as SwOrderLineItem } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { OrderLineItem } from '@hubblecommerce/hubble/commons'
import { hblMapOrderLineItem } from '#imports'

export function hblMapOrderLineItems (swOrderLineItem: SwOrderLineItem[]): OrderLineItem[] {
    return swOrderLineItem.map((item) => {
        return hblMapOrderLineItem(item)
    })
}
