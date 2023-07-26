/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Added since version: 6.0.0.0
 */
export type OrderDeliveryPosition = {
    id?: string;
    versionId?: string;
    orderDeliveryId: string;
    orderDeliveryVersionId?: string;
    orderLineItemId: string;
    orderLineItemVersionId?: string;
    price?: {
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
    unitPrice?: number;
    totalPrice?: number;
    quantity?: number;
    customFields?: Record<string, any>;
    readonly createdAt: string;
    readonly updatedAt?: string;
};

