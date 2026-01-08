import { type OrderLineItemDownload as SwOrderLineItemDownload } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { type HblOrderLineItemDownload } from '../../types'

export function hblMapOrderLineItemDownload (orderLineItemDownload: SwOrderLineItemDownload): HblOrderLineItemDownload {
    return {
        id: orderLineItemDownload.id != null ? orderLineItemDownload.id : '',
        fileName: `${orderLineItemDownload.media?.fileName}.${orderLineItemDownload.media?.fileExtension}`,
        canBeDownloaded: orderLineItemDownload.accessGranted
    }
}
