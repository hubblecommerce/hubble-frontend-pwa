/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { LineItem } from './LineItem';
import type { Struct } from './Struct';

export type CartItems = (Struct & {
    items?: Array<LineItem>;
});

