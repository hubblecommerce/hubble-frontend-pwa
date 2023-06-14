import { Salutation as SwSalutation } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { HblSalutation } from '@/utils/types'
import { hblMapSalutation } from '#imports'

export function hblMapSalutations (salutations: SwSalutation[]): HblSalutation[] {
    return salutations.map((salutation) => {
        return hblMapSalutation(salutation)
    })
}
