import { Salutation as SwSalutation } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { Salutation } from '@hubblecommerce/hubble/commons'

export function hblMapSalutation (salutation: SwSalutation): Salutation {
    return {
        // @ts-ignore
        id: salutation.id,
        name: salutation.translated?.displayName
    }
}
