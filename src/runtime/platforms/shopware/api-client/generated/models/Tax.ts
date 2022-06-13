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
     * Added since version: 6.4.0.0
     */
    position: number;
    customFields?: any;
    readonly createdAt: string;
    readonly updatedAt?: string;
};

