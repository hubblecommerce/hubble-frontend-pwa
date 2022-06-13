/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { resource } from './resource';

/**
 * Added since version: 6.0.0.0
 */
export type LanguageJsonApi = (resource & {
    id?: string;
    parentId?: string;
    localeId: string;
    translationCodeId?: string;
    name: string;
    customFields?: any;
    readonly createdAt: string;
    readonly updatedAt?: string;
    relationships?: any;
});

