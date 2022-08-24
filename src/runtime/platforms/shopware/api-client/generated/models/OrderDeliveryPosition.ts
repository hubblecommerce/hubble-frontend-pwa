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
    unitPrice?: number;
    totalPrice?: number;
    quantity?: number;
    customFields?: any;
    readonly createdAt: string;
    readonly updatedAt?: string;
};

