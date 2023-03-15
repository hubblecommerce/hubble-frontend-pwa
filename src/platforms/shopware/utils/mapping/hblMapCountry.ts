import { Country as SwCountry } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { Country } from '@hubblecommerce/hubble/commons'

export function hblMapCountry (country: SwCountry): Country {
    return {
        // @ts-ignore
        id: country.id,
        name: country.translated?.name
    }
}
