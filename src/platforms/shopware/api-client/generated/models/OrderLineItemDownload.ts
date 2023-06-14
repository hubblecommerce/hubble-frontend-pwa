/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Media } from './Media';
import type { OrderLineItem } from './OrderLineItem';

/**
 * Added since version: 6.4.19.0
 */
export type OrderLineItemDownload = {
    id?: string;
    versionId?: string;
    orderLineItemId: string;
    orderLineItemVersionId?: string;
    mediaId: string;
    position: number;
    accessGranted: boolean;
    customFields?: any;
    readonly createdAt: string;
    readonly updatedAt?: string;
    orderLineItem?: OrderLineItem;
    media?: Media;
};

