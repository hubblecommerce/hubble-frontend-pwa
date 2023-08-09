/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProductListingResult } from './ProductListingResult';

export type WishlistLoadRouteResponse = {
    wishlist?: {
        customerId?: string;
        salesChannelId?: string;
    };
    products?: Array<ProductListingResult>;
};

