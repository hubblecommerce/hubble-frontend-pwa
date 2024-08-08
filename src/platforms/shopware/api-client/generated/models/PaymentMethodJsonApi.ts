/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { resource } from './resource';
/**
 * Added since version: 6.0.0.0
 */
export type PaymentMethodJsonApi = (resource & {
    id: string;
    name: string;
    readonly distinguishableName?: string;
    description?: string;
    position?: number;
    active?: boolean;
    afterOrderEnabled?: boolean;
    customFields?: Record<string, any>;
    mediaId?: string;
    /**
     * Runtime field, cannot be used as part of the criteria.
     */
    readonly synchronous?: boolean;
    /**
     * Runtime field, cannot be used as part of the criteria.
     */
    readonly asynchronous?: boolean;
    /**
     * Runtime field, cannot be used as part of the criteria.
     */
    readonly prepared?: boolean;
    /**
     * Runtime field, cannot be used as part of the criteria.
     */
    readonly refundable?: boolean;
    /**
     * Runtime field, cannot be used as part of the criteria.
     */
    readonly recurring?: boolean;
    /**
     * Runtime field, cannot be used as part of the criteria.
     */
    shortName?: string;
    technicalName?: string;
    readonly createdAt: string;
    readonly updatedAt?: string;
    translated?: Record<string, any>;
    relationships?: {
        media?: {
            links?: {
                related?: string;
            };
            data?: {
                type?: string;
                id?: string;
            };
        };
    };
});

