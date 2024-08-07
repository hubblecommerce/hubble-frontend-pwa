/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Media } from './Media';
/**
 * Added since version: 6.0.0.0
 */
export type Theme = {
    id: string;
    technicalName?: string;
    name: string;
    author: string;
    description?: string;
    labels?: Record<string, any>;
    helpTexts?: Record<string, any>;
    customFields?: Record<string, any>;
    previewMediaId?: string;
    parentThemeId?: string;
    baseConfig?: Record<string, any>;
    configValues?: Record<string, any>;
    active: boolean;
    readonly createdAt: string;
    readonly updatedAt?: string;
    translated?: Record<string, any>;
    media?: Array<Media>;
};

