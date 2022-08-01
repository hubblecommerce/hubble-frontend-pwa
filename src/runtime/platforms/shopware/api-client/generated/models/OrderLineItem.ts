/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Media } from './Media';
import type { OrderDeliveryPosition } from './OrderDeliveryPosition';

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
    payload?: any;
    good?: boolean;
    removable?: boolean;
    stackable?: boolean;
    position: number;
    priceDefinition?: any;
    unitPrice?: number;
    totalPrice?: number;
    description?: string;
    type?: string;
    customFields?: any;
    readonly createdAt: string;
    readonly updatedAt?: string;
    cover?: Media;
    orderDeliveryPositions?: OrderDeliveryPosition;
    parent?: OrderLineItem;
    children: OrderLineItem;
};

