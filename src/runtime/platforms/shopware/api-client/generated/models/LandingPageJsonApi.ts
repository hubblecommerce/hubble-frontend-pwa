/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { resource } from './resource';

/**
 * Added since version: 6.4.0.0
 */
export type LandingPageJsonApi = (resource & {
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
    relationships?: any;
});

