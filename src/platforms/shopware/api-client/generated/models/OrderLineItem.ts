/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Media } from './Media';
import type { OrderDeliveryPosition } from './OrderDeliveryPosition';
import type { OrderLineItemDownload } from './OrderLineItemDownload';

/**
 * Added since version: 6.0.0.0
 */
export type OrderLineItem = {
    id?: string;
    versionId?: string;
    orderId: string;
    orderVersionId?: string;
    productId?: string;
    productVersionId?: string;
    parentId?: string;
    parentVersionId?: string;
    coverId?: string;
    identifier: string;
    referencedId?: string;
    quantity: number;
    label: string;
    payload?: Record<string, any>;
    good?: boolean;
    removable?: boolean;
    stackable?: boolean;
    position: number;
    states: Array<string>;
    priceDefinition?: Record<string, any>;
    unitPrice?: number;
    totalPrice?: number;
    description?: string;
    type?: string;
    customFields?: Record<string, any>;
    readonly createdAt: string;
    readonly updatedAt?: string;
    cover?: Media;
    orderDeliveryPositions?: OrderDeliveryPosition;
    downloads?: OrderLineItemDownload;
    parent?: OrderLineItem;
    children: OrderLineItem;
};

