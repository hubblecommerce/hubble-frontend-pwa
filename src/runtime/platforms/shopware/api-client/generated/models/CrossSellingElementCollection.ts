/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Product } from './Product';

export type CrossSellingElementCollection = Array<{
    crossSelling?: {
        name?: string;
        position?: number;
        sortBy?: string;
        sortDirection?: string;
        limit?: number;
        active?: boolean;
        productId?: string;
        productStreamId?: string;
        type?: string;
    };
    products?: Array<Product>;
    total?: number;
}>;
