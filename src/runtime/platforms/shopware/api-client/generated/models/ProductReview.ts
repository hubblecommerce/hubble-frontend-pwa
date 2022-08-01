/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Added since version: 6.0.0.0
 */
export type ProductReview = {
    id?: string;
    productId: string;
    productVersionId?: string;
    salesChannelId: string;
    languageId: string;
    title: string;
    content: string;
    points?: number;
    status?: boolean;
    comment?: string;
    customFields?: any;
    readonly createdAt: string;
    readonly updatedAt?: string;
};

