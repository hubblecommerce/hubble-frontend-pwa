/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Media } from './Media';

/**
 * Added since version: 6.0.0.0
 */
export type Theme = {
    id?: string;
    technicalName?: string;
    name: string;
    author: string;
    description?: string;
    labels?: any;
    helpTexts?: any;
    customFields?: any;
    previewMediaId?: string;
    parentThemeId?: string;
    baseConfig?: any;
    configValues?: any;
    active: boolean;
    readonly createdAt: string;
    readonly updatedAt?: string;
    translated?: any;
    media?: Media;
};

