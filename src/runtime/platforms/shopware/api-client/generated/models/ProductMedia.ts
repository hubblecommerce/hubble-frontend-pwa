/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Media } from './Media';

/**
 * Added since version: 6.0.0.0
 */
export type ProductMedia = {
    id?: string;
    versionId?: string;
    productId: string;
    productVersionId?: string;
    mediaId: string;
    position?: number;
    customFields?: any;
    readonly createdAt: string;
    readonly updatedAt?: string;
    media?: Media;
};

