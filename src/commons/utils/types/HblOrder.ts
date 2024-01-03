import { type HblCustomerBillingAddress, type HblCustomerShippingAddress } from '@/utils/types/HblCustomer'
import { type HblShippingMethod } from '@/utils/types/HblShippingMethod'
import { type HblPaymentMethod } from '@/utils/types/HblPaymentMethod'
import { type HblTotals } from '@/utils/types/HblCart'
import { type HblMedia } from '@/utils/types/HblMedia'
import { type HblOrderLineItemDownload } from '@/utils/types/HblOrderLineItemDownload'
import { type HblOrderDocument } from '@/utils/types/HblOrderDocument'

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
    shippingMethod?: HblShippingMethod
}
