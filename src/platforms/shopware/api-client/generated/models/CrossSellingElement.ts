/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Product } from './Product';
import type { ProductCrossSelling } from './ProductCrossSelling';
export type CrossSellingElement = {
    crossSelling: ProductCrossSelling;
    products: Array<Product>;
    total: number;
    streamId?: string;
    apiAlias: 'cross_selling_element';
};

