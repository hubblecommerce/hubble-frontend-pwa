/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Media } from './Media';
import type { PropertyGroup } from './PropertyGroup';
/**
 * Added since version: 6.0.0.0
 */
export type PropertyGroupOption = {
    id: string;
    groupId: string;
    name: string;
    position?: number;
    colorHexCode?: string;
    mediaId?: string;
    customFields?: Record<string, any>;
    readonly createdAt: string;
    readonly updatedAt?: string;
    translated?: Record<string, any>;
    media?: Media;
    group: PropertyGroup;
    option: string;
};

