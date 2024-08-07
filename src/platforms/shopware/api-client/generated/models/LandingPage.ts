/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CmsPage } from './CmsPage';
import type { SeoUrl } from './SeoUrl';
/**
 * Added since version: 6.4.0.0
 */
export type LandingPage = {
    id: string;
    versionId?: string;
    active?: boolean;
    name: string;
    customFields?: Record<string, any>;
    slotConfig?: Record<string, any>;
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
    url: string;
    cmsPageId?: string;
    cmsPageVersionId?: string;
    readonly createdAt: string;
    readonly updatedAt?: string;
    translated?: Record<string, any>;
    cmsPage?: CmsPage;
    seoUrls?: Array<SeoUrl>;
    apiAlias: 'landing_page';
};

