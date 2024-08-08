/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderLineItem } from './OrderLineItem';
import type { OrderTransactionCaptureRefund } from './OrderTransactionCaptureRefund';
/**
 * Added since version: 6.4.12.0
 */
export type OrderTransactionCaptureRefundPosition = {
    id: string;
    versionId?: string;
    refundId: string;
    refundVersionId?: string;
    orderLineItemId: string;
    orderLineItemVersionId?: string;
    externalReference?: string;
    reason?: string;
    quantity?: number;
    amount: {
        unitPrice: number;
        totalPrice: number;
        quantity: number;
        calculatedTaxes?: Record<string, any>;
        taxRules?: Record<string, any>;
        referencePrice?: Record<string, any>;
        listPrice?: {
            price?: number;
            discount?: number;
            percentage?: number;
        };
        regulationPrice?: {
            price?: number;
        };
    };
    customFields?: Record<string, any>;
    readonly createdAt: string;
    readonly updatedAt?: string;
    orderLineItem?: OrderLineItem;
    orderTransactionCaptureRefund?: OrderTransactionCaptureRefund;
};

