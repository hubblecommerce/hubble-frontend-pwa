/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderAddress } from './OrderAddress';
import type { OrderDeliveryPosition } from './OrderDeliveryPosition';
import type { ShippingMethod } from './ShippingMethod';
import type { StateMachineState } from './StateMachineState';
/**
 * Added since version: 6.0.0.0
 */
export type OrderDelivery = {
    id: string;
    versionId?: string;
    orderId: string;
    orderVersionId?: string;
    shippingOrderAddressId: string;
    shippingOrderAddressVersionId?: string;
    shippingMethodId: string;
    stateId: string;
    trackingCodes: Array<string>;
    shippingDateEarliest: string;
    shippingDateLatest: string;
    shippingCosts?: {
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
    stateMachineState?: StateMachineState;
    shippingOrderAddress?: OrderAddress;
    shippingMethod?: ShippingMethod;
    positions?: Array<OrderDeliveryPosition>;
};

