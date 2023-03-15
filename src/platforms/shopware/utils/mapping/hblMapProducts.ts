import { Product as SwProduct } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { Product } from '@hubblecommerce/hubble/commons'
import { hblMapProduct } from '#imports'

export function hblMapProducts (swProducts: SwProduct[]): Product[] {
    return swProducts.map((swProduct: SwProduct) => {
        return hblMapProduct(swProduct)
    })
}
