/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PaymentMethod } from './PaymentMethod';
import type { StateMachineState } from './StateMachineState';

/**
 * Added since version: 6.0.0.0
 */
export type OrderTransaction = {
    id?: string;
    versionId?: string;
    orderId: string;
    orderVersionId?: string;
    paymentMethodId: string;
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
    };
    stateId: string;
    customFields?: any;
    readonly createdAt: string;
    readonly updatedAt?: string;
    stateMachineState?: StateMachineState;
    paymentMethod?: PaymentMethod;
};

