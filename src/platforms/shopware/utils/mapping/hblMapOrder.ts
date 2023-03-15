import { Order as SwOrder } from '@hubblecommerce/hubble/platforms/shopware/api-client'
import { Order } from '@hubblecommerce/hubble/commons'
import { hblMapOrderLineItems, hblMapCustomerAddress, hblMapShippingMethod, hblMapPaymentMethod, hblMapTotals } from '#imports'

export function hblMapOrder (swOrder: SwOrder): Order {
    return {
        // @ts-ignore
        id: swOrder.id,
        // @ts-ignore
        orderNumber: swOrder.orderNumber,
        // @ts-ignore
        email: swOrder.orderCustomer.email,
        // @ts-ignore
        shippingAddress: hblMapCustomerAddress(swOrder.deliveries[0].shippingOrderAddress),
        // @ts-ignore
        billingAddress: hblMapCustomerAddress(swOrder.billingAddress),
        // @ts-ignore
        shippingMethod: hblMapShippingMethod(swOrder.deliveries[0].shippingMethod),
        // @ts-ignore
        paymentMethod: hblMapPaymentMethod(swOrder.transactions[0].paymentMethod),
        // TODO: patch api client
        // @ts-ignore
        lineItems: hblMapOrderLineItems(swOrder.lineItems),
        totals: hblMapTotals(swOrder.price),
        // @ts-ignore
        orderDate: swOrder.orderDate,
        // @ts-ignore
        status: swOrder.stateMachineState.translated.name
    }
}
