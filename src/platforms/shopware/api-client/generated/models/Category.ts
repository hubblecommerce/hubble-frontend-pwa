/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CmsPage } from './CmsPage';
import type { Media } from './Media';
import type { SeoUrl } from './SeoUrl';
import type { Tag } from './Tag';
/**
 * Added since version: 6.0.0.0
 */
export type Category = {
    id: string;
    versionId?: string;
    parentId?: string;
    parentVersionId?: string;
    afterCategoryId?: string;
    afterCategoryVersionId?: string;
    mediaId?: string;
    displayNestedProducts: boolean;
    readonly breadcrumb: Array<string>;
    readonly level?: number;
    readonly path?: string;
    readonly childCount: number;
    type: string;
    productAssignmentType: string;
    visible?: boolean;
    active?: boolean;
    /**
     * Runtime field, cannot be used as part of the criteria.
     */
    cmsPageIdSwitched?: boolean;
    /**
     * Runtime field, cannot be used as part of the criteria.
     */
    visibleChildCount?: number;
    name: string;
    customFields?: Record<string, any>;
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
    customEntityTypeId?: string;
    readonly createdAt: string;
    readonly updatedAt?: string;
    translated: Record<string, any>;
    parent?: Category;
    children: Array<Category> | null;
    media?: Media;
    tags?: Array<Tag>;
    cmsPage?: CmsPage;
    seoUrls?: Array<SeoUrl>;
    apiAlias?: 'category';
};

