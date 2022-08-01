/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Media } from './Media';

/**
 * Added since version: 6.0.0.0
 */
export type DocumentBaseConfig = {
    id?: string;
    documentTypeId: string;
    logoId?: string;
    name: string;
    filenamePrefix?: string;
    filenameSuffix?: string;
    global: boolean;
    documentNumber?: string;
    config?: any;
    readonly createdAt: string;
    customFields?: any;
    readonly updatedAt?: string;
    logo?: Media;
};

