/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LineItemType } from './LineItemType';
export type LineItem = {
    id: string;
    referencedId?: string;
    label?: string;
    quantity?: number;
    type: LineItemType;
    good?: boolean;
    description?: string;
    removable?: boolean;
    stackable?: boolean;
    modified?: boolean;
};

