/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { resource } from './resource';

/**
 * Added since version: 6.0.0.0
 */
export type CategoryJsonApi = (resource & {
    id?: string;
    versionId?: string;
    parentId?: string;
    parentVersionId?: string;
    afterCategoryId?: string;
    afterCategoryVersionId?: string;
    mediaId?: string;
    displayNestedProducts: boolean;
    readonly breadcrumb?: Array<any>;
    readonly level?: number;
    readonly path?: string;
    readonly childCount?: number;
    type: string;
    productAssignmentType: string;
    visible?: boolean;
    active?: boolean;
    name: string;
    customFields?: any;
    linkType?: string;
    internalLink?: string;
    externalLink?: string;
    linkNewTab?: boolean;
    description?: string;
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
    cmsPageId?: string;
    cmsPageVersionId?: string;
    readonly createdAt: string;
    readonly updatedAt?: string;
    translated?: any;
    relationships?: any;
});

