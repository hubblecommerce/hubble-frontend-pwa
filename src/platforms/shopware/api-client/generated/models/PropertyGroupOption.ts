/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Media } from './Media';
import type { PropertyGroup } from './PropertyGroup';

/**
 * Added since version: 6.0.0.0
 */
export type PropertyGroupOption = {
    id?: string;
    groupId: string;
    name: string;
    position?: number;
    colorHexCode?: string;
    mediaId?: string;
    customFields?: any;
    readonly createdAt: string;
    readonly updatedAt?: string;
    translated?: any;
    media?: Media;
    group?: PropertyGroup;
};

