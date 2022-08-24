/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { OrderTransaction } from './OrderTransaction';
import type { OrderTransactionCaptureRefund } from './OrderTransactionCaptureRefund';
import type { StateMachineState } from './StateMachineState';

/**
 * Added since version: 6.4.12.0
 */
export type OrderTransactionCapture = {
    id?: string;
    orderTransactionId: string;
    orderTransactionVersionId?: string;
    stateId: string;
    externalReference?: string;
    totalAmount?: number;
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
    customFields?: any;
    readonly createdAt: string;
    readonly updatedAt?: string;
    stateMachineState?: StateMachineState;
    transaction?: OrderTransaction;
    refunds?: OrderTransactionCaptureRefund;
};

