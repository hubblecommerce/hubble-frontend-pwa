/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Added since version: 6.0.0.0
 */
export type Tax = {
    id?: string;
    taxRate: number;
    name: string;
    /**
     * Added since version: 6.4.0.0.
     */
    position: number;
    customFields?: Record<string, any>;
    readonly createdAt: string;
    readonly updatedAt?: string;
};

