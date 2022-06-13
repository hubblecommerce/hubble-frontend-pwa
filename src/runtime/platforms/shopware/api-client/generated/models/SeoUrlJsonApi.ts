/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { resource } from './resource';

/**
 * Added since version: 6.0.0.0
 */
export type SeoUrlJsonApi = (resource & {
    id?: string;
    salesChannelId?: string;
    languageId: string;
    foreignKey: string;
    routeName: string;
    pathInfo: string;
    seoPathInfo: string;
    isCanonical?: boolean;
    isModified?: boolean;
    isDeleted?: boolean;
    url?: string;
    customFields?: any;
    readonly createdAt: string;
    readonly updatedAt?: string;
});

