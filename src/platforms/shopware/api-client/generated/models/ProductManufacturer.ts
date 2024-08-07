/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Media } from './Media';
/**
 * Added since version: 6.0.0.0
 */
export type ProductManufacturer = {
    id: string;
    versionId?: string;
    mediaId?: string;
    link?: string;
    name: string;
    description?: string;
    customFields?: Record<string, any>;
    readonly createdAt: string;
    readonly updatedAt?: string;
    translated?: Record<string, any>;
    media?: Media;
};

