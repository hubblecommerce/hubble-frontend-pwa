import { HblCustomerBillingAddress, HblCustomerShippingAddress } from '@/utils/types/HblCustomer'
import { HblShippingMethod } from '@/utils/types/HblShippingMethod'
import { HblPaymentMethod } from '@/utils/types/HblPaymentMethod'
import { HblTotals } from '@/utils/types/HblCart'
import { HblMedia } from '@/utils/types/HblMedia'
import { HblOrderLineItemDownload } from '@/utils/types/HblOrderLineItemDownload'

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
    shippingAddress?: HblCustomerShippingAddress,
    shippingMethod?: HblShippingMethod
}
