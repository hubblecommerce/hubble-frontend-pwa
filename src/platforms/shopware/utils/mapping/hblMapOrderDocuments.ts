import { type Document as SwDocument } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { type HblOrderDocument } from '@/utils/types'
import { hblMapOrderDocument } from '#imports'

export function hblMapOrderDocuments (swDocuments: SwDocument[]): HblOrderDocument[] {
    return swDocuments.map((documents) => {
        return hblMapOrderDocument(documents)
    })
}
