import { type SalesChannelContext } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { type HblSession } from '../../types'
import { hblMapShippingMethod, hblMapPaymentMethod } from '#imports'

export function hblMapSession (swPlatform: SalesChannelContext): HblSession {
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
