import { SalesChannelContext } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { Session } from '@hubblecommerce/hubble/commons'
import { hblMapShippingMethod, hblMapPaymentMethod } from '#imports'

export function hblMapSession (swPlatform: SalesChannelContext): Session {
    return {
        // @ts-ignore
        sessionToken: swPlatform.token,
        currency: swPlatform?.currency?.isoCode,
        language: swPlatform?.salesChannel?.languageId,
        maintenance: swPlatform?.salesChannel?.maintenance,
        // TODO: path api client
        // @ts-ignore
        shippingMethod: hblMapShippingMethod(swPlatform.shippingMethod),
        // TODO: path api client
        // @ts-ignore
        paymentMethod: hblMapPaymentMethod(swPlatform.paymentMethod)
    }
}
