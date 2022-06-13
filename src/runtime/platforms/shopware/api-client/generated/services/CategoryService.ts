/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Category } from '../models/Category';
import type { Criteria } from '../models/Criteria';
import type { EntitySearchResult } from '../models/EntitySearchResult';
import type { NavigationRouteResponse } from '../models/NavigationRouteResponse';
import type { ProductListingCriteria } from '../models/ProductListingCriteria';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CategoryService {

    /**
     * Fetch a list of categories
     * Perform a filtered search for categories.
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @param requestBody
     * @returns any Entity search result containing categories.
     * @throws ApiError
     */
    public static readCategoryList(
        contentType: string = 'application/json',
        accept: string = 'application/json',
        requestBody?: Criteria,
    ): CancelablePromise<({
        elements?: Array<Category>;
    } & EntitySearchResult)> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/category',
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Fetch a single category
     * This endpoint returns information about the category, as well as a fully resolved (hydrated with mapping values) CMS page, if one is assigned to the category. You can pass slots which should be resolved exclusively.
     * @param categoryId Identifier of the category to be fetched
     * @param slots Resolves only the given slot identifiers. The identifiers have to be seperated by a '|' character
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @param requestBody
     * @returns Category The loaded category with cms page
     * @throws ApiError
     */
    public static readCategory(
        categoryId: string,
        slots?: string,
        contentType: string = 'application/json',
        accept: string = 'application/json',
        requestBody?: (Criteria & ProductListingCriteria),
    ): CancelablePromise<Category> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/category/{categoryId}',
            path: {
                'categoryId': categoryId,
            },
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            query: {
                'slots': slots,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Fetch a navigation menu
     * This endpoint returns categories that can be used as a page navigation. You can either return them as a tree or as a flat list. You can also control the depth of the tree.
     *
     * Instead of passing uuids, you can also use one of the following aliases for the activeId and rootId parameters to get the respective navigations of your sales channel.
     *
     * * main-navigation
     * * service-navigation
     * * footer-navigation
     * @param requestActiveId Identifier of the active category in the navigation tree (if not used, just set to the same as rootId).
     * @param requestRootId Identifier of the root category for your desired navigation tree. You can use it to fetch sub-trees of your navigation tree.
     * @param requestBody
     * @param swIncludeSeoUrls Instructs Shopware to try and resolve SEO URLs for the given navigation item
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @returns NavigationRouteResponse All available navigations
     * @throws ApiError
     */
    public static readNavigation(
        requestActiveId: string,
        requestRootId: string,
        requestBody: (Criteria & {
            /**
             * Determines the depth of fetched navigation levels.
             */
            depth?: any;
            /**
             * Return the categories as a tree or as a flat list.
             */
            buildTree?: any;
        }),
        swIncludeSeoUrls?: boolean,
        contentType: string = 'application/json',
        accept: string = 'application/json',
    ): CancelablePromise<NavigationRouteResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/navigation/{requestActiveId}/{requestRootId}',
            path: {
                'requestActiveId': requestActiveId,
                'requestRootId': requestRootId,
            },
            headers: {
                'sw-include-seo-urls': swIncludeSeoUrls,
                'Content-Type': contentType,
                'Accept': accept,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
