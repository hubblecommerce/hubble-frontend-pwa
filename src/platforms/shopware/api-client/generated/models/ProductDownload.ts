/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Media } from './Media';
import type { Product } from './Product';
/**
 * Added since version: 6.4.19.0
 */
export type ProductDownload = {
    id: string;
    versionId?: string;
    productId: string;
    productVersionId?: string;
    mediaId: string;
    position?: number;
    customFields?: Record<string, any>;
    readonly createdAt: string;
    readonly updatedAt?: string;
    product?: Product;
    media?: Media;
};

