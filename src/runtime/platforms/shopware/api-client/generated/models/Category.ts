/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CmsPage } from './CmsPage';
import type { Media } from './Media';
import type { SeoUrl } from './SeoUrl';

/**
 * Added since version: 6.0.0.0
 */
export type Category = {
    id?: string;
    versionId?: string;
    parentId?: string;
    parentVersionId?: string;
    afterCategoryId?: string;
    afterCategoryVersionId?: string;
    mediaId?: string;
    displayNestedProducts: boolean;
    readonly breadcrumb?: any;
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
    parent?: Category;
    children?: Array<Category>;
    media?: Media;
    cmsPage?: CmsPage;
    seoUrls?: Array<SeoUrl>;
};

