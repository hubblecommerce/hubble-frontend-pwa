/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntitySearchResult } from './EntitySearchResult';
import type { Product } from './Product';
export type ProductListingResult = (EntitySearchResult & {
    /**
     * Contains the state of the filters. These can be used to create listing filters.
     */
    currentFilters: {
        navigationId: string;
        manufacturer: Array<string>;
        price: {
            min: number;
            max: number;
        };
        rating: number | null;
        'shipping-free': boolean;
        properties: Array<string>;
        search?: string;
    };
    /**
     * Contains the available sorting. These can be used to show a sorting select-box in the product listing.
     */
    availableSortings: Array<{
        label: string;
        translated: {
            label: string;
        };
        key: string;
        priority: number;
        apiAlias: 'product_sorting';
    }>;
    sorting?: string;
    elements: Array<Product>;
    entity?: 'product';
    apiAlias: 'product_listing';
});

