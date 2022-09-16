/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PropertyGroupOption } from './PropertyGroupOption';

/**
 * Added since version: 6.0.0.0
 */
export type PropertyGroup = {
    id?: string;
    name: string;
    description?: string;
    displayType: string;
    sortingType: string;
    filterable?: boolean;
    visibleOnProductDetailPage?: boolean;
    position?: number;
    customFields?: any;
    readonly createdAt: string;
    readonly updatedAt?: string;
    translated?: any;
    options?: PropertyGroupOption;
};

