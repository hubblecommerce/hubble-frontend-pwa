/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Criteria } from './Criteria';
export type ProductListingCriteria = (Criteria & {
    /**
     * Specifies the sorting of the products by `availableSortings`. If not set, the default sorting will be set according to the shop settings. The available sorting options are sent within the response under the `availableSortings` key. In order to sort by a field, consider using the `sort` parameter from the listing criteria. Do not use both parameters together, as it might lead to unexpected results.
     */
    order?: string;
    /**
     * Number of items per result page. If not set, the limit will be set according to the default products per page, defined in the system settings.
     */
    limit?: number;
    /**
     * Search result page
     */
    'p'?: number;
    /**
     * Filter by manufacturers. List of manufacturer identifiers separated by a `|`.
     */
    manufacturer?: string;
    /**
     * Filters by a minimum product price. Has to be lower than the `max-price` filter.
     */
    'min-price'?: number;
    /**
     * Filters by a maximum product price. Has to be higher than the `min-price` filter.
     */
    'max-price'?: number;
    /**
     * Filter products with a minimum average rating.
     */
    rating?: number;
    /**
     * Filters products that are marked as shipping-free.
     */
    'shipping-free'?: boolean;
    /**
     * Filters products by their properties. List of property identifiers separated by a `|`.
     */
    properties?: string;
    /**
     * Enables/disabled filtering by manufacturer. If set to false, the `manufacturer` filter will be ignored. Also the `aggregations[manufacturer]` key will be removed from the response.
     */
    'manufacturer-filter'?: boolean;
    /**
     * Enables/disabled filtering by price. If set to false, the `min-price` and `max-price` filter will be ignored. Also the `aggregations[price]` key will be removed from the response.
     */
    'price-filter'?: boolean;
    /**
     * Enables/disabled filtering by rating. If set to false, the `rating` filter will be ignored. Also the `aggregations[rating]` key will be removed from the response.
     */
    'rating-filter'?: boolean;
    /**
     * Enables/disabled filtering by shipping-free products. If set to false, the `shipping-free` filter will be ignored. Also the `aggregations[shipping-free]` key will be removed from the response.
     */
    'shipping-free-filter'?: boolean;
    /**
     * Enables/disabled filtering by properties products. If set to false, the `properties` filter will be ignored. Also the `aggregations[properties]` key will be removed from the response.
     */
    'property-filter'?: boolean;
    /**
     * A whitelist of property identifiers which can be used for filtering. List of property identifiers separated by a `|`. The `property-filter` must be `true`, otherwise the whitelist has no effect.
     */
    'property-whitelist'?: string;
    /**
     * By sending the parameter `reduce-aggregations` , the post-filters that were applied by the customer, are also applied to the aggregations. This has the consequence that only values are returned in the aggregations that would lead to further filter results. This parameter is a flag, the value has no effect.
     */
    'reduce-aggregations'?: string | null;
});

