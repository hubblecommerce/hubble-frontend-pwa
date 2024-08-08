/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Added since version: 6.0.0.0
 */
export type ShippingMethodPrice = {
    id: string;
    shippingMethodId: string;
    ruleId?: string;
    calculation?: number;
    calculationRuleId?: string;
    quantityStart?: number;
    quantityEnd?: number;
    currencyPrice?: Record<string, any>;
    customFields?: Record<string, any>;
    readonly createdAt: string;
    readonly updatedAt?: string;
};

