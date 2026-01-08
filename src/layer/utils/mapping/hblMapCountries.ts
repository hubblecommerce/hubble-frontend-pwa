import { type Country as SwCountry } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { type HblCountry } from '../../types'
import { hblMapCountry } from '#imports'

export function hblMapCountries (countries: SwCountry[]): HblCountry[] {
    return countries.map((country) => {
        return hblMapCountry(country)
    })
}
