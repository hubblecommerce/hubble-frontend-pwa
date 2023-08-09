/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Salutation } from './Salutation';

/**
 * Added since version: 6.0.0.0
 */
export type OrderCustomer = {
    id?: string;
    versionId?: string;
    email: string;
    salutationId: string;
    firstName: string;
    lastName: string;
    company?: string;
    title?: string;
    vatIds?: Array<string>;
    customerNumber?: string;
    customFields?: Record<string, any>;
    readonly createdAt: string;
    readonly updatedAt?: string;
    salutation?: Salutation;
};

