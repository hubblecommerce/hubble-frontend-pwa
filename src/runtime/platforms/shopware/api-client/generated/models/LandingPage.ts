/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CmsPage } from './CmsPage';
import type { SeoUrl } from './SeoUrl';

/**
 * Added since version: 6.4.0.0
 */
export type LandingPage = {
    id?: string;
    versionId?: string;
    active?: boolean;
    name: string;
    customFields?: any;
    slotConfig?: any;
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
    url: string;
    cmsPageId?: string;
    cmsPageVersionId?: string;
    readonly createdAt: string;
    readonly updatedAt?: string;
    translated?: any;
    cmsPage?: CmsPage;
    seoUrls?: SeoUrl;
};

