/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Locale } from './Locale';
/**
 * Added since version: 6.0.0.0
 */
export type Language = {
    id: string;
    parentId?: string;
    localeId: string;
    translationCodeId?: string;
    name: string;
    customFields?: Record<string, any>;
    readonly createdAt: string;
    readonly updatedAt?: string;
    parent?: Language;
    locale?: Locale;
    translationCode?: Locale;
    children?: Array<Language>;
};

