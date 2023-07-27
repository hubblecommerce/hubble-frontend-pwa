import { OrderLineItemDownload as SwOrderLineItemDownload } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { HblOrderLineItemDownload } from '@/utils/types'

export function hblMapOrderLineItemDownload (orderLineItemDownload: SwOrderLineItemDownload): HblOrderLineItemDownload {
    return {
        id: orderLineItemDownload.id,
        fileName: `${orderLineItemDownload.media?.fileName}.${orderLineItemDownload.media?.fileExtension}`,
        canBeDownloaded: orderLineItemDownload.accessGranted
    }
}
