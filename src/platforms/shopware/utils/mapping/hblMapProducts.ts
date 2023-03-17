import { Product as SwProduct } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { HblProduct } from '@/utils/types'
import { hblMapProduct } from '#imports'

export function hblMapProducts (swProducts: SwProduct[]): HblProduct[] {
    return swProducts.map((swProduct: SwProduct) => {
        return hblMapProduct(swProduct)
    })
}
