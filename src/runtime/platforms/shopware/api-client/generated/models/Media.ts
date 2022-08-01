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
    readonly metaData?: any;
    alt?: string;
    title?: string;
    url?: string;
    hasFile?: boolean;
    private?: boolean;
    customFields?: any;
    readonly createdAt: string;
    readonly updatedAt?: string;
    translated?: any;
    thumbnails?: Array<MediaThumbnail>;
};

