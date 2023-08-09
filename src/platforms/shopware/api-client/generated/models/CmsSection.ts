/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CmsBlock } from './CmsBlock';
import type { CmsPage } from './CmsPage';
import type { Media } from './Media';

/**
 * Added since version: 6.0.0.0
 */
export type CmsSection = {
    id?: string;
    position: number;
    type: string;
    name?: string;
    sizingMode?: string;
    mobileBehavior?: string;
    backgroundColor?: string;
    backgroundMediaId?: string;
    backgroundMediaMode?: string;
    cssClass?: string;
    pageId: string;
    visibility?: {
        mobile?: boolean;
        desktop?: boolean;
        tablet?: boolean;
    };
    customFields?: Record<string, any>;
    cmsPageVersionId?: string;
    readonly createdAt: string;
    readonly updatedAt?: string;
    page?: CmsPage;
    backgroundMedia?: Media;
    blocks?: CmsBlock[];
};

