import { LineItem as SwLineItem } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { LineItem } from '@hubblecommerce/hubble/commons'
import { hblMapLineItem } from '#imports'

export function hblMapLineItems (lineItems: SwLineItem[]): LineItem[] {
    return lineItems.map((lineItem) => {
        return hblMapLineItem(lineItem)
    })
}
