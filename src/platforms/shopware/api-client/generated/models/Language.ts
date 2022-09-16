/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Locale } from './Locale';

/**
 * Added since version: 6.0.0.0
 */
export type Language = {
    id?: string;
    parentId?: string;
    localeId: string;
    translationCodeId?: string;
    name: string;
    customFields?: any;
    readonly createdAt: string;
    readonly updatedAt?: string;
    parent?: Language;
    locale?: Locale;
    translationCode?: Locale;
    children?: Language;
};

