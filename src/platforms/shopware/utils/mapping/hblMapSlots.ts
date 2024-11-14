import { type CmsSlot } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { type HblMedia, type HblProductListing, type HblSlot } from '@/utils/types'
import { hblMapMedia, hblMediaIncludes, hblMapProductListing, hblProductListingIncludes } from '#imports'

export const hblSlotIncludes = {
    'cms_slot': [
        'type',
        'slot',
        'data',
        'media',
    ],
    ...hblMediaIncludes,
    ...hblProductListingIncludes
}

export function hblMapSlots (swSlots: CmsSlot[]): HblSlot[] {
    let productListing: HblProductListing | null = null
    let media: HblMedia | null = null

    return swSlots.map((slot: CmsSlot) => {
        if (slot.data?.listing != null) {
            productListing = hblMapProductListing(slot.data.listing)
        }

        if (slot.data?.media != null) {
            media = hblMapMedia(slot.data.media)
        }

        return {
            type: slot.type,
            position: slot.slot,
            data: slot.data,
            ...(productListing != null && { productListing }),
            ...(media != null && { media })
        }
    }) as HblSlot[]
}
