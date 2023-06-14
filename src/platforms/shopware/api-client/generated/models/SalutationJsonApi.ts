/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { resource } from './resource';

/**
 * Added since version: 6.0.0.0
 */
export type SalutationJsonApi = (resource & {
    id?: string;
    salutationKey: string;
    displayName: string;
    letterName: string;
    customFields?: any;
    readonly createdAt: string;
    readonly updatedAt?: string;
    translated?: any;
});

