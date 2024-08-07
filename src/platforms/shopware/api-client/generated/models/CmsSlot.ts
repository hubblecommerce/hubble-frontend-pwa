/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CmsBlock } from './CmsBlock';
/**
 * Added since version: 6.0.0.0
 */
export type CmsSlot = {
    id?: string;
    versionId?: string;
    type: string;
    slot: string;
    locked?: boolean;
    config?: Record<string, any>;
    customFields?: Record<string, any>;
    readonly data?: Record<string, any>;
    blockId: string;
    fieldConfig?: Record<string, any>;
    cmsBlockVersionId?: string;
    readonly createdAt: string;
    readonly updatedAt?: string;
    translated?: Record<string, any>;
    block?: CmsBlock;
};

