/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Added since version: 6.0.0.0
 */
export type MediaThumbnail = {
    id: string;
    mediaId: string;
    readonly width: number;
    readonly height: number;
    /**
     * Runtime field, cannot be used as part of the criteria.
     */
    url: string;
    path?: string;
    customFields?: Record<string, any>;
    readonly createdAt: string;
    readonly updatedAt?: string;
};

