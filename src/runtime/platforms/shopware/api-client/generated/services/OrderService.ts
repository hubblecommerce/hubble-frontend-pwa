/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Criteria } from '../models/Criteria';
import type { Order } from '../models/Order';
import type { OrderRouteResponse } from '../models/OrderRouteResponse';
import type { StateMachineState } from '../models/StateMachineState';
import type { SuccessResponse } from '../models/SuccessResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class OrderService {

    /**
     * Create an order from a cart
     * Creates a new order from the current cart and deletes the cart.
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @param requestBody
     * @returns Order Order
     * @throws ApiError
     */
    public static createOrder(
        contentType: string = 'application/json',
        accept: string = 'application/json',
        requestBody?: {
            /**
             * Adds a comment from the customer to the order.
             */
            customerComment?: string;
            /**
             * The affiliate code can be used to track which referrer the customer came through. An example could be `Price-comparison-company-XY`.
             */
            affiliateCode?: string;
            /**
             * The campaign code is used to track which action the customer came from. An example could be `Summer-Deals`
             */
            campaignCode?: string;
        },
    ): CancelablePromise<Order> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/checkout/order',
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Cancel an order
     * Cancels an order. The order state will be set to 'cancelled'.
     * @param requestBody
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @returns StateMachineState Returns the state of the state machine
     *
     * example: More information about the state machine can be found in the corresponding guide: [Using the state machine](https://developer.shopware.com/docs/guides/plugins/plugins/checkout/order/using-the-state-machine)
     * @throws ApiError
     */
    public static cancelOrder(
        requestBody: {
            /**
             * The identifier of the order to be canceled.
             */
            orderId?: string;
        },
        contentType: string = 'application/json',
        accept: string = 'application/json',
    ): CancelablePromise<StateMachineState> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/order/state/cancel',
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Fetch a list of orders
     * List orders of a customer.
     * @param requestBody
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @returns OrderRouteResponse An array of orders and an indicator if the payment of the order can be changed.
     * @throws ApiError
     */
    public static readOrder(
        requestBody: (Criteria & {
            /**
             * Check if the payment method of the order is still changeable.
             */
            checkPromotion?: boolean;
        }),
        contentType: string = 'application/json',
        accept: string = 'application/json',
    ): CancelablePromise<OrderRouteResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/order',
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Update the payment method of an order
     * Changes the payment method of a specific order. You can use the /order route to find out if the payment method of an order can be changed - take a look at the `paymentChangeable`- array in the response.
     * @param requestBody
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @returns SuccessResponse Successfully updated the payment method of the order.
     * @throws ApiError
     */
    public static orderSetPayment(
        requestBody: {
            /**
             * The identifier of the paymentMethod to be set
             */
            paymentMethodId: string;
            /**
             * The identifier of the order.
             */
            orderId: string;
        },
        contentType: string = 'application/json',
        accept: string = 'application/json',
    ): CancelablePromise<SuccessResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/order/payment',
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
