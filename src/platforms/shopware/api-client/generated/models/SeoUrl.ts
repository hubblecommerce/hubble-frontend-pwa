/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Added since version: 6.0.0.0
 */
export type SeoUrl = {
    id: string;
    salesChannelId?: string;
    languageId: string;
    foreignKey: string;
    routeName: 'frontend.navigation.page' | 'frontend.landing.page' | 'frontend.detail.page';
    pathInfo: string;
    seoPathInfo: string;
    isCanonical?: boolean;
    isModified?: boolean;
    isDeleted?: boolean;
    /**
     * Runtime field, cannot be used as part of the criteria.
     */
    error?: string;
    /**
     * Runtime field, cannot be used as part of the criteria.
     */
    url?: string;
    customFields?: Record<string, any>;
    readonly createdAt: string;
    readonly updatedAt?: string;
};

