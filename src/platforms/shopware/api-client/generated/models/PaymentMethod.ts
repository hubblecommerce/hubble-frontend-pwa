/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Media } from './Media';

/**
 * Added since version: 6.0.0.0
 */
export type PaymentMethod = {
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
    media?: Media;
};

