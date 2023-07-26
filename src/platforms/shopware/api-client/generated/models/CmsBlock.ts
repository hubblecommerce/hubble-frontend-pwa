/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CmsSlot } from './CmsSlot';
import type { Media } from './Media';

/**
 * Added since version: 6.0.0.0
 */
export type CmsBlock = {
    _uniqueIdentifier: string,
    id?: string;
    position: number;
    type: string;
    name?: string;
    sectionPosition?: string;
    marginTop?: string;
    marginBottom?: string;
    marginLeft?: string;
    marginRight?: string;
    backgroundColor?: string;
    backgroundMediaId?: string;
    backgroundMediaMode?: string;
    cssClass?: string;
    visibility?: {
        mobile?: boolean;
        desktop?: boolean;
        tablet?: boolean;
    };
    sectionId: string;
    customFields?: Record<string, any>;
    versionId?: string;
    cmsSectionVersionId?: string;
    readonly createdAt: string;
    readonly updatedAt?: string;
    backgroundMedia?: Media;
    slots?: CmsSlot[];
};

