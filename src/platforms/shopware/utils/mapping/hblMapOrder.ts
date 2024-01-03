import { type Order as SwOrder } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { type HblOrder } from '@/utils/types'
import { hblMapOrderLineItems, hblMapCustomerAddress, hblMapShippingMethod, hblMapPaymentMethod, hblMapTotals, hblMapOrderDocuments } from '#imports'

export function hblMapOrder (swOrder: SwOrder): HblOrder {
    return {
        // @ts-ignore
        id: swOrder.id,
        // @ts-ignore
        orderNumber: swOrder.orderNumber,
        // @ts-ignore
        email: swOrder.orderCustomer.email,
        // @ts-ignore
        billingAddress: hblMapCustomerAddress(swOrder.billingAddress),
        // @ts-ignore
        paymentMethod: hblMapPaymentMethod(swOrder.transactions?.[0].paymentMethod),
        // TODO: patch api client
        // @ts-ignore
        lineItems: hblMapOrderLineItems(swOrder.lineItems),
        totals: hblMapTotals(swOrder.price),
        // @ts-ignore
        orderDate: swOrder.orderDate,
        // @ts-ignore
        status: swOrder.stateMachineState.translated.name,
        // @ts-ignore
        documents: hblMapOrderDocuments(swOrder.documents),
        // @ts-ignore
        ...(swOrder.deliveries?.length > 0 && { shippingMethod: hblMapShippingMethod(swOrder.deliveries?.[0].shippingMethod) }),
        // @ts-ignore
        ...(swOrder.deliveries?.length > 0 && { shippingAddress: hblMapCustomerAddress(swOrder.deliveries?.[0].shippingOrderAddress) })
    }
}
