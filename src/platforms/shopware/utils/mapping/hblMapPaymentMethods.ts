import { PaymentMethod as SwPaymentMethod } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { HblPaymentMethod } from '@/utils/types'
import { hblMapPaymentMethod } from '#imports'

export function hblMapPaymentMethods (swPaymentMethods: SwPaymentMethod[]): HblPaymentMethod[] {
    return swPaymentMethods.map((swPaymentMethod) => {
        return hblMapPaymentMethod(swPaymentMethod)
    })
}
