/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { OrderLineItem } from './OrderLineItem';
import type { OrderTransactionCaptureRefund } from './OrderTransactionCaptureRefund';

/**
 * Added since version: 6.4.12.0
 */
export type OrderTransactionCaptureRefundPosition = {
    id?: string;
    refundId: string;
    orderLineItemId: string;
    orderLineItemVersionId?: string;
    externalReference?: string;
    reason?: string;
    quantity?: number;
    amount: {
        unitPrice: number;
        totalPrice: number;
        quantity: number;
        calculatedTaxes?: any;
        taxRules?: any;
        referencePrice?: any;
        listPrice?: {
            price?: number;
            discount?: number;
            percentage?: number;
        };
        regulationPrice?: {
            price?: number;
        };
    };
    /**
     * Runtime field, cannot be used as part of the criteria.
     */
    refundPrice?: number;
    customFields?: any;
    readonly createdAt: string;
    readonly updatedAt?: string;
    orderLineItem?: OrderLineItem;
    orderTransactionCaptureRefund?: OrderTransactionCaptureRefund;
};

