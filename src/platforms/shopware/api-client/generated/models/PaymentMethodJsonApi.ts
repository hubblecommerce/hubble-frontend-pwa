/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { resource } from './resource';

/**
 * Added since version: 6.0.0.0
 */
export type PaymentMethodJsonApi = (resource & {
    id?: string;
    name: string;
    readonly distinguishableName?: string;
    description?: string;
    position?: number;
    active?: boolean;
    afterOrderEnabled?: boolean;
    customFields?: any;
    mediaId?: string;
    readonly synchronous?: boolean;
    readonly asynchronous?: boolean;
    readonly prepared?: boolean;
    readonly refundable?: boolean;
    readonly createdAt: string;
    readonly updatedAt?: string;
    translated?: any;
    relationships?: any;
});

