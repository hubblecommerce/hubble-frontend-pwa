import { type Product as SwProduct } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { type HblProduct } from '@/utils/types'
import { hblMapProduct } from '#imports'

export function hblMapProducts (swProducts: SwProduct[]): HblProduct[] {
    return swProducts.map((swProduct: SwProduct) => {
        return hblMapProduct(swProduct)
    })
}
