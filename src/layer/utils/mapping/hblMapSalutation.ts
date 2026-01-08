import { type Salutation as SwSalutation } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { type HblSalutation } from '../../types'

export function hblMapSalutation (salutation: SwSalutation): HblSalutation {
    return {
        id: salutation.id,
        name: salutation.translated?.displayName
    }
}
