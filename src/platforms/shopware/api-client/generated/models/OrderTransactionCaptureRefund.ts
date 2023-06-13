/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { OrderTransactionCapture } from './OrderTransactionCapture';
import type { OrderTransactionCaptureRefundPosition } from './OrderTransactionCaptureRefundPosition';
import type { StateMachineState } from './StateMachineState';

/**
 * Added since version: 6.4.12.0
 */
export type OrderTransactionCaptureRefund = {
    id?: string;
    captureId: string;
    stateId: string;
    externalReference?: string;
    reason?: string;
    /**
     * Runtime field, cannot be used as part of the criteria.
     */
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
    transactionCapture?: OrderTransactionCapture;
    positions?: OrderTransactionCaptureRefundPosition;
};

