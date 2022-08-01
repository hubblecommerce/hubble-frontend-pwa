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
    config?: any;
    customFields?: any;
    readonly data?: any;
    blockId: string;
    cmsBlockVersionId?: string;
    readonly createdAt: string;
    readonly updatedAt?: string;
    translated?: any;
    block?: CmsBlock;
};

