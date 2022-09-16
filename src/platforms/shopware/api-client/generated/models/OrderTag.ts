/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Order } from './Order';
import type { Tag } from './Tag';

/**
 * Added since version: 6.0.0.0
 */
export type OrderTag = {
    id?: string;
    orderId: string;
    orderVersionId?: string;
    tagId: string;
    order?: Order;
    tag?: Tag;
};

