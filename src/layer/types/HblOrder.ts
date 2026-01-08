import { type HblCustomerBillingAddress, type HblCustomerShippingAddress } from './HblCustomer'
import { type HblShippingMethod } from './HblShippingMethod'
import { type HblPaymentMethod } from './HblPaymentMethod'
import { type HblTotals } from './HblCart'
import { type HblMedia } from './HblMedia'
import { type HblOrderLineItemDownload } from './HblOrderLineItemDownload'
import { type HblOrderDocument } from './HblOrderDocument'

export interface HblOrderLineItem {
    id: string,
    name: string,
    media: HblMedia,
    quantity: number,
    price: number,
    downloads?: HblOrderLineItemDownload[]
}

export interface HblOrder {
    id: string,
    orderNumber: string,
    email: string,
    billingAddress: HblCustomerBillingAddress,
    paymentMethod: HblPaymentMethod,
    lineItems: HblOrderLineItem[],
    totals: HblTotals,
    orderDate: string,
    status: string,
    documents: HblOrderDocument[],
    shippingAddress?: HblCustomerShippingAddress,
    shippingMethod?: HblShippingMethod,
    shippingTotal: number | null
}
