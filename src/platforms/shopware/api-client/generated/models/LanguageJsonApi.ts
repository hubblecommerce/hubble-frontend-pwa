/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { resource } from './resource';
/**
 * Added since version: 6.0.0.0
 */
export type LanguageJsonApi = (resource & {
    id: string;
    parentId?: string;
    localeId: string;
    translationCodeId?: string;
    name: string;
    customFields?: Record<string, any>;
    readonly createdAt: string;
    readonly updatedAt?: string;
    relationships?: {
        parent?: {
            links?: {
                related?: string;
            };
            data?: {
                type?: string;
                id?: string;
            };
        };
        locale?: {
            links?: {
                related?: string;
            };
            data?: {
                type?: string;
                id?: string;
            };
        };
        translationCode?: {
            links?: {
                related?: string;
            };
            data?: {
                type?: string;
                id?: string;
            };
        };
        children?: {
            links?: {
                related?: string;
            };
            data?: Array<{
                type?: string;
                id?: string;
            }>;
        };
    };
});

