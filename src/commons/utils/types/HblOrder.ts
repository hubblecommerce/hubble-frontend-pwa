import { HblCustomerBillingAddress, HblCustomerShippingAddress } from '@/utils/types/HblCustomer'
import { HblShippingMethod } from '@/utils/types/HblShippingMethod'
import { HblPaymentMethod } from '@/utils/types/HblPaymentMethod'
import { HblTotals } from '@/utils/types/HblCart'
import { HblMedia } from '@/utils/types/HblMedia'

export interface HblOrderLineItem {
    id: string,
    name: string,
    media: HblMedia,
    quantity: number,
    price: number
}

export interface HblOrder {
    id: string,
    orderNumber: string,
    email: string,
    shippingAddress: HblCustomerShippingAddress,
    billingAddress: HblCustomerBillingAddress,
    shippingMethod: HblShippingMethod,
    paymentMethod: HblPaymentMethod,
    lineItems: HblOrderLineItem[],
    totals: HblTotals,
    orderDate: string,
    status: string
}
