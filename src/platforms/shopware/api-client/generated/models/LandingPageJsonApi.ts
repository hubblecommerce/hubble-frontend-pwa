/* generated using openapi-typescript-codegen -- do no edit */
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
    relationships?: any;
});

