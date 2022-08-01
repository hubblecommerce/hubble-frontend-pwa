/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { resource } from './resource';

/**
 * Added since version: 6.0.0.0
 */
export type ShippingMethodJsonApi = (resource & {
    id?: string;
    name: string;
    active?: boolean;
    customFields?: any;
    mediaId?: string;
    deliveryTimeId: string;
    taxType: string;
    description?: string;
    trackingUrl?: string;
    readonly createdAt: string;
    readonly updatedAt?: string;
    translated?: any;
    relationships?: any;
});

