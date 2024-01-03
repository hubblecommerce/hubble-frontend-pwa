import { type Country as SwCountry } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { type HblCountry } from '@/utils/types'

export function hblMapCountry (country: SwCountry): HblCountry {
    return {
        // @ts-ignore
        id: country.id,
        name: country.translated?.name
    }
}
