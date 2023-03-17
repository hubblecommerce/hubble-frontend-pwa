import { Salutation as SwSalutation } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { HblSalutation } from '@/utils/types'

export function hblMapSalutation (salutation: SwSalutation): HblSalutation {
    return {
        // @ts-ignore
        id: salutation.id,
        name: salutation.translated?.displayName
    }
}
