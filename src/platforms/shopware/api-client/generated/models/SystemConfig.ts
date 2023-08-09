/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SalesChannel } from './SalesChannel';

/**
 * Added since version: 6.0.0.0
 */
export type SystemConfig = {
    id?: string;
    configurationKey: string;
    configurationValue: {
        _value?: Record<string, any>;
    };
    salesChannelId?: string;
    readonly createdAt: string;
    readonly updatedAt?: string;
    salesChannel?: SalesChannel;
};

