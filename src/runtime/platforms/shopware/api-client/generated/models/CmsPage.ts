/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CmsSection } from './CmsSection';
import type { LandingPage } from './LandingPage';
import type { Media } from './Media';

/**
 * Added since version: 6.0.0.0
 */
export type CmsPage = {
    id?: string;
    versionId?: string;
    name?: string;
    type: string;
    entity?: string;
    cssClass?: string;
    config?: {
        backgroundColor?: string;
    };
    previewMediaId?: string;
    customFields?: any;
    readonly createdAt: string;
    readonly updatedAt?: string;
    translated?: any;
    sections?: CmsSection;
    previewMedia?: Media;
    landingPages?: LandingPage;
};

