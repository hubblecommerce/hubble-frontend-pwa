/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderTransactionCapture } from './OrderTransactionCapture';
import type { PaymentMethod } from './PaymentMethod';
import type { StateMachineState } from './StateMachineState';
/**
 * Added since version: 6.0.0.0
 */
export type OrderTransaction = {
    id: string;
    versionId?: string;
    orderId: string;
    orderVersionId?: string;
    paymentMethodId: string;
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
    stateId: string;
    customFields?: Record<string, any>;
    readonly createdAt: string;
    readonly updatedAt?: string;
    stateMachineState?: StateMachineState;
    paymentMethod?: PaymentMethod;
    captures?: Array<OrderTransactionCapture>;
};

