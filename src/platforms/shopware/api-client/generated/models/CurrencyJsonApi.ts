/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { resource } from './resource';
/**
 * Added since version: 6.0.0.0
 */
export type CurrencyJsonApi = (resource & {
    id: string;
    factor: number;
    symbol: string;
    isoCode: string;
    shortName: string;
    name: string;
    position?: number;
    /**
     * Runtime field, cannot be used as part of the criteria.
     */
    isSystemDefault?: boolean;
    taxFreeFrom?: number;
    customFields?: Record<string, any>;
    itemRounding: {
        decimals: number;
        interval: number;
        roundForNet: boolean;
    };
    totalRounding: {
        decimals: number;
        interval: number;
        roundForNet: boolean;
    };
    readonly createdAt: string;
    readonly updatedAt?: string;
    translated?: Record<string, any>;
});

