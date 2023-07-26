/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Struct } from './Struct';

export type EntitySearchResult = (Struct & {
    entity?: string;
    /**
     * The total number of found entities
     */
    total?: number;
    /**
     * Contains aggregated data. A simple example is the determination of the average price from a product search query.
     */
    aggregations?: Array<Record<string, any>>;
    /**
     * The actual page. This can be used for pagination.
     */
    page?: number;
    /**
     * The actual limit. This is used for pagination and goes together with the page.
     */
    limit?: number;
});

