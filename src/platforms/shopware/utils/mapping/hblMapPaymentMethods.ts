import { PaymentMethod as SwPaymentMethod } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { PaymentMethod } from '@hubblecommerce/hubble/commons'
import { hblMapPaymentMethod } from '#imports'

export function hblMapPaymentMethods (swPaymentMethods: SwPaymentMethod[]): PaymentMethod[] {
    return swPaymentMethods.map((swPaymentMethod) => {
        return hblMapPaymentMethod(swPaymentMethod)
    })
}
