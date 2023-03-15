import { CmsSlot } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { Media, ProductListing, Slot } from '@hubblecommerce/hubble/commons'
import { hblMapMedia, hblMapProductListing } from '#imports'

export function hblMapSlots (swSlots: CmsSlot[]): Slot[] {
    let productListing: ProductListing | null = null
    let media: Media | null = null

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
    })
}
