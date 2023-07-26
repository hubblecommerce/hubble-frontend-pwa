/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DeliveryTime } from './DeliveryTime';
import type { Media } from './Media';
import type { Rule } from './Rule';
import type { ShippingMethodPrice } from './ShippingMethodPrice';
import type { Tag } from './Tag';
import type { Tax } from './Tax';

/**
 * Added since version: 6.0.0.0
 */
export type ShippingMethod = {
    id?: string;
    name: string;
    active?: boolean;
    position?: number;
    customFields?: Record<string, any>;
    mediaId?: string;
    deliveryTimeId: string;
    taxType: string;
    description?: string;
    trackingUrl?: string;
    readonly createdAt: string;
    readonly updatedAt?: string;
    translated?: Record<string, any>;
    deliveryTime?: DeliveryTime;
    availabilityRule?: Rule;
    prices?: ShippingMethodPrice;
    media?: Media;
    tags?: Tag;
    tax?: Tax;
};

