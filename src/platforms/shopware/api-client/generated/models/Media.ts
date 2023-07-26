/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { MediaThumbnail } from './MediaThumbnail';

/**
 * Added since version: 6.0.0.0
 */
export type Media = {
    id?: string;
    readonly mimeType?: string;
    readonly fileExtension?: string;
    readonly uploadedAt?: string;
    readonly fileName?: string;
    readonly fileSize?: number;
    readonly metaData?: Record<string, any>;
    alt?: string;
    title?: string;
    /**
     * Runtime field, cannot be used as part of the criteria.
     */
    url?: string;
    /**
     * Runtime field, cannot be used as part of the criteria.
     */
    hasFile?: boolean;
    private?: boolean;
    customFields?: Record<string, any>;
    readonly createdAt: string;
    readonly updatedAt?: string;
    translated?: Record<string, any>;
    thumbnails?: Array<MediaThumbnail>;
};

