/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Cart } from '../models/Cart';
import type { CartItems } from '../models/CartItems';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CartShopware {

    /**
     * Fetch or create a cart
     * Used to fetch the current cart or for creating a new one.
     * @param name The name of the new cart. This parameter will only be used when creating a new cart.
     * @returns Cart Cart
     * @throws ApiError
     */
    public static readCart(
        name?: string,
    ): CancelablePromise<Cart> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/checkout/cart',
            query: {
                'name': name,
            },
        });
    }

    /**
     * Delete a cart
     * This route deletes the cart of the customer.
     * @returns void
     * @throws ApiError
     */
    public static deleteCart(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/checkout/cart',
        });
    }

    /**
     * Add items to the cart
     * This route adds items to the cart. An item can be a product or promotion for example. They are referenced by the `referencedId`-parameter.
     *
     * Example: [Working with the cart - Guide](https://developer.shopware.com/docs/guides/integrations-api/store-api-guide/work-with-the-cart#adding-new-items-to-the-cart)
     * @param requestBody
     * @returns Cart The updated cart.
     * @throws ApiError
     */
    public static addLineItem(
        requestBody?: CartItems,
    ): CancelablePromise<Cart> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/checkout/cart/line-item',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Remove items from the cart
     * This route removes items from the cart and recalculates it.
     *
     * Example: [Working with the cart - Guide](https://developer.shopware.com/docs/guides/integrations-api/store-api-guide/work-with-the-cart#deleting-items-in-the-cart)
     * @param ids A list of product identifiers.
     * @returns Cart The updated cart.
     * @throws ApiError
     */
    public static removeLineItem(
        ids: Array<string>,
    ): CancelablePromise<Cart> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/checkout/cart/line-item',
            query: {
                'ids': ids,
            },
        });
    }

    /**
     * Update items in the cart
     * This route updates items in the cart. A typical example is updating the quantity of an item.
     *
     * Example: [Working with the cart - Guide](https://developer.shopware.com/docs/guides/integrations-api/store-api-guide/work-with-the-cart#updating-items-in-the-cart)
     * @param requestBody
     * @returns Cart The updated cart.
     * @throws ApiError
     */
    public static updateLineItem(
        requestBody?: CartItems,
    ): CancelablePromise<Cart> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/checkout/cart/line-item',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
