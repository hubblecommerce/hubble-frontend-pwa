import { OrderLineItemDownload as SwOrderLineItemDownload } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { HblOrderLineItemDownload } from '@/utils/types'
import { hblMapOrderLineItemDownload } from '#imports'

export function hblMapOrderLineItemDownloads (swOrderLineItemDownloads: SwOrderLineItemDownload[]): HblOrderLineItemDownload[] {
    return swOrderLineItemDownloads.map((orderLineItemDownload) => {
        return hblMapOrderLineItemDownload(orderLineItemDownload)
    })
}
