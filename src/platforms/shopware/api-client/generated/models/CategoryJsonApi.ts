/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { resource } from './resource';
/**
 * Added since version: 6.0.0.0
 */
export type CategoryJsonApi = (resource & {
    id: string;
    versionId?: string;
    parentId?: string;
    parentVersionId?: string;
    afterCategoryId?: string;
    afterCategoryVersionId?: string;
    mediaId?: string;
    displayNestedProducts: boolean;
    readonly breadcrumb?: Array<Record<string, any>>;
    readonly level?: number;
    readonly path?: string;
    readonly childCount?: number;
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
    translated?: Record<string, any>;
    relationships?: {
        parent?: {
            links?: {
                related?: string;
            };
            data?: {
                type?: string;
                id?: string;
            };
        };
        children?: {
            links?: {
                related?: string;
            };
            data?: Array<{
                type?: string;
                id?: string;
            }>;
        };
        media?: {
            links?: {
                related?: string;
            };
            data?: {
                type?: string;
                id?: string;
            };
        };
        tags?: {
            links?: {
                related?: string;
            };
            data?: Array<{
                type?: string;
                id?: string;
            }>;
        };
        cmsPage?: {
            links?: {
                related?: string;
            };
            data?: {
                type?: string;
                id?: string;
            };
        };
        seoUrls?: {
            links?: {
                related?: string;
            };
            data?: Array<{
                type?: string;
                id?: string;
            }>;
        };
    };
});

