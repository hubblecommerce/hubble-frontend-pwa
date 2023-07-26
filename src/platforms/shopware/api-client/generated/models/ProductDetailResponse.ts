/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Product } from './Product';
import type { PropertyGroup } from './PropertyGroup';

/**
 * Represents a product along with detailed information required to display a variant selection.
 */
export type ProductDetailResponse = {
    product?: Product;
    /**
     * List of property groups with their corresponding options and information on how to display them.
     */
    configurator?: Array<PropertyGroup>;
};

