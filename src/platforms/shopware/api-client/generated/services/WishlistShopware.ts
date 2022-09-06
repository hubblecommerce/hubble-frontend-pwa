/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Criteria } from '../models/Criteria';
import type { SuccessResponse } from '../models/SuccessResponse';
import type { WishlistLoadRouteResponse } from '../models/WishlistLoadRouteResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class WishlistShopware {

    /**
     * Add a product to a wishlist
     * Adds a product to a customers wishlist.
     *
     * **Important constraints**
     *
     * * Anonymous (not logged-in) customers can not have wishlists.
     * * The wishlist feature has to be activated.
     * @param productId Identifier of the product to be added.
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @returns SuccessResponse Returns a success response.
     * @throws ApiError
     */
    public static addProductOnWishlist(
        productId: string,
        contentType: string = 'application/json',
        accept: string = 'application/json',
    ): CancelablePromise<SuccessResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/customer/wishlist/add/{productId}',
            path: {
                'productId': productId,
            },
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
        });
    }

    /**
     * Fetch a wishlist
     * Fetch a customer's wishlist. Products on the wishlist can be filtered using a criteria object.
     *
     * **Important constraints**
     *
     * * Anonymous (not logged-in) customers can not have wishlists.
     * * The wishlist feature has to be activated.
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @param requestBody
     * @returns WishlistLoadRouteResponse
     * @throws ApiError
     */
    public static readCustomerWishlist(
        contentType: string = 'application/json',
        accept: string = 'application/json',
        requestBody?: Criteria,
    ): CancelablePromise<WishlistLoadRouteResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/customer/wishlist',
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Create a wishlist for a customer
     * Create a new wishlist for a logged in customer or extend the existing wishlist given a set of products.
     *
     * **Important constraints**
     *
     * * Anonymous (not logged-in) customers can not have wishlists.
     * * A customer can only have a single wishlist.
     * * The wishlist feature has to be activated.
     * @param requestBody
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @returns SuccessResponse Returns a success response.
     * @throws ApiError
     */
    public static mergeProductOnWishlist(
        requestBody: {
            /**
             * List product id
             */
            productIds?: Array<string>;
        },
        contentType: string = 'application/json',
        accept: string = 'application/json',
    ): CancelablePromise<SuccessResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/customer/wishlist/merge',
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Remove a product from a wishlist
     * Removes a product from a customer's wishlist.
     *
     * **Important constraints**
     *
     * * Anonymous (not logged-in) customers can not have wishlists.
     * * The wishlist feature has to be activated.
     * @param productId The identifier of the product to be removed from the wishlist.
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @returns SuccessResponse Returns a success response indicating a successful removal.
     * @throws ApiError
     */
    public static deleteProductOnWishlist(
        productId: string,
        contentType: string = 'application/json',
        accept: string = 'application/json',
    ): CancelablePromise<SuccessResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/customer/wishlist/delete/{productId}',
            path: {
                'productId': productId,
            },
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            errors: {
                404: `The removal of the product failed. Probably because the product could not be found on the wishlist.`,
            },
        });
    }

}
