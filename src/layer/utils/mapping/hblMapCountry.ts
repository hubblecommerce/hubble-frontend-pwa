import { type Country as SwCountry } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { type HblCountry } from '../../types'

export function hblMapCountry (country: SwCountry): HblCountry {
    return {
        id: country.id,
        name: country.translated?.name
    }
}
