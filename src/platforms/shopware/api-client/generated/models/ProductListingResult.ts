/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EntitySearchResult } from './EntitySearchResult';
import type { Product } from './Product';

export type ProductListingResult = (EntitySearchResult & {
    /**
     * Contains the state of the filters. These can be used to create listing filters.
     */
    currentFilters?: {
        navigationId?: string;
        manufacturer?: Array<any>;
        price?: {
            min?: number;
            max?: number;
        };
        rating?: number;
        'shipping-free'?: boolean;
        properties?: Array<any>;
    };
    /**
     * Contains the available sorting. These can be used to show a sorting select-box in the product listing.
     */
    availableSortings?: Array<any>;
    sorting?: string;
    elements?: Array<Product>;
});

