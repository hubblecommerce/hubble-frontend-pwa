/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ListPrice } from './ListPrice';
import type { ReferencePrice } from './ReferencePrice';
/**
 * Represents a product along with detailed information required to display a variant selection.
 */
export type CalculatedPrice = {
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    calculatedTaxes: Array<{
        apiAlias: 'cart_tax_calculated';
        tax: number;
        taxRate: number;
        price: number;
    }>;
    referencePrice: ReferencePrice | null;
    listPrice: ListPrice | null;
    regulationPrice: {
        price?: number;
        apiAlias?: 'cart_regulation_price';
    } | null;
    hasRange: boolean;
    variantId?: string | null;
    apiAlias: 'calculated_price';
};

