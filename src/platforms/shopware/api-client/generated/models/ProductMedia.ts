/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Media } from './Media';
import type { MediaThumbnail } from './MediaThumbnail';
/**
 * Added since version: 6.0.0.0
 */
export type ProductMedia = {
    id: string;
    versionId?: string;
    productId: string;
    productVersionId?: string;
    mediaId: string;
    position?: number;
    customFields?: Record<string, any>;
    readonly createdAt: string;
    readonly updatedAt?: string;
    media?: Media;
    thumbnails?: MediaThumbnail;
};

