/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * Added since version: 6.0.0.0
 */
export type SeoUrl = {
    id?: string;
    salesChannelId?: string;
    languageId: string;
    foreignKey: string;
    routeName: string;
    pathInfo: string;
    seoPathInfo: string;
    isCanonical?: boolean;
    isModified?: boolean;
    isDeleted?: boolean;
    /**
     * Runtime field, cannot be used as part of the criteria.
     */
    url?: string;
    customFields?: Record<string, any>;
    /**
     * Runtime field, cannot be used as part of the criteria.
     */
    isValid?: boolean;
    readonly createdAt: string;
    readonly updatedAt?: string;
};

