import { Country as SwCountry } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { Country } from '@hubblecommerce/hubble/commons'
import { hblMapCountry } from '#imports'

export function hblMapCountries (countries: SwCountry[]): Country[] {
    return countries.map((country) => {
        return hblMapCountry(country)
    })
}
