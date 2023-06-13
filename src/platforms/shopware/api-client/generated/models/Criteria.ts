/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Search parameters. For more information, see our documentation on [Search Queries](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#structure)
 */
export type Criteria = {
    /**
     * Search result page
     */
    page?: number;
    /**
     * Number of items per result page
     */
    limit?: number;
    /**
     * List of filters to restrict the search result. For more information, see [Search Queries > Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#filter)
     */
    filter?: Array<{
        type: string;
        field: string;
        value: string;
    }>;
    /**
     * Sorting in the search result.
     */
    sort?: Array<{
        field: string;
        order?: string;
        naturalSorting?: boolean;
    }>;
    /**
     * Filters that applied without affecting aggregations. For more information, see [Search Queries > Post Filter](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#post-filter)
     */
    'post-filter'?: Array<{
        type: string;
        field: string;
        value: string;
    }>;
    /**
     * Used to fetch associations which are not fetched by default.
     */
    associations?: any;
    /**
     * Used to perform aggregations on the search result. For more information, see [Search Queries > Aggregations](https://shopware.stoplight.io/docs/store-api/docs/concepts/search-queries.md#aggregations)
     */
    aggregations?: Array<{
        /**
         * Give your aggregation an identifier, so you can find it easier
         */
        name: string;
        /**
         * The type of aggregation
         */
        type: string;
        /**
         * The field you want to aggregate over.
         */
        field: string;
    }>;
    /**
     * Perform groupings over certain fields
     */
    grouping?: Array<string>;
    /**
     * Fields which should be returned in the search result.
     */
    fields?: Array<string>;
    /**
     * Whether the total for the total number of hits should be determined for the search query. 0 = disabled total count, 1 = calculate exact total amount (slow), 2 = calculate only for next page (fast)
     */
    'total-count-mode'?: 0 | 1 | 2;
    /**
     * Restricts the output to the defined fields
     */
    includes?: any;
};

