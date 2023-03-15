import { Salutation as SwSalutation } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { Salutation } from '@hubblecommerce/hubble/commons'
import { hblMapSalutation } from '#imports'

export function hblMapSalutations (salutations: SwSalutation[]): Salutation[] {
    return salutations.map((salutation) => {
        return hblMapSalutation(salutation)
    })
}
