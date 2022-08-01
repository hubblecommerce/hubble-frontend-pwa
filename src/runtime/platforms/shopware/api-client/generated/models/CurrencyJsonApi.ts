/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { resource } from './resource';

/**
 * Added since version: 6.0.0.0
 */
export type CurrencyJsonApi = (resource & {
    id?: string;
    factor: number;
    symbol: string;
    isoCode: string;
    shortName: string;
    name: string;
    position?: number;
    isSystemDefault?: boolean;
    customFields?: any;
    taxFreeFrom?: number;
    readonly createdAt: string;
    readonly updatedAt?: string;
    translated?: any;
});

