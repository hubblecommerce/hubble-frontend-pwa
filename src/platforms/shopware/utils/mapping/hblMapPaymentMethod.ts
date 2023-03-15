import { PaymentMethod as SwPaymentMethod } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { PaymentMethod } from '@hubblecommerce/hubble/commons'
import { hblMapMedia } from '#imports'

export function hblMapPaymentMethod (swPaymentMethod: SwPaymentMethod): PaymentMethod {
    return {
        // @ts-ignore
        id: swPaymentMethod.id,
        // Todo patch api
        // @ts-ignore
        code: swPaymentMethod.shortName,
        position: swPaymentMethod.position != null ? swPaymentMethod.position : 1,
        name: swPaymentMethod.translated.name,
        ...(swPaymentMethod.translated.description != null && { description: swPaymentMethod.translated.description }),
        ...(swPaymentMethod.media != null && { media: hblMapMedia(swPaymentMethod.media) }),
        ...(swPaymentMethod.synchronous != null && { synchronous: swPaymentMethod.synchronous }),
        ...(swPaymentMethod.asynchronous != null && { asynchronous: swPaymentMethod.asynchronous })
    }
}
