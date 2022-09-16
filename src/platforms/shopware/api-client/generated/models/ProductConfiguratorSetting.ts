/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Media } from './Media';
import type { PropertyGroupOption } from './PropertyGroupOption';

/**
 * Added since version: 6.0.0.0
 */
export type ProductConfiguratorSetting = {
    id?: string;
    versionId?: string;
    productId: string;
    productVersionId?: string;
    mediaId?: string;
    optionId: string;
    position?: number;
    customFields?: any;
    readonly createdAt: string;
    readonly updatedAt?: string;
    media?: Media;
    option?: PropertyGroupOption;
};

