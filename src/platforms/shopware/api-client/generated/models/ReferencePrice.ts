/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ListPrice } from './ListPrice';
export type ReferencePrice = {
    purchaseUnit?: number;
    referenceUnit?: number;
    unitName: string;
    price?: number;
    apiAlias?: 'cart_price_reference';
    listPrice: ListPrice | null;
    regulationPrice: {
        price?: number;
        apiAlias?: 'cart_regulation_price';
    } | null;
    hasRange: boolean;
    variantId?: string | null;
};

