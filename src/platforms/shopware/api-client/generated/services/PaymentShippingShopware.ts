/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Criteria } from '../models/Criteria';
import type { ShippingMethod } from '../models/ShippingMethod';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PaymentShippingShopware {

    /**
     * Initiate a payment for an order
     * This generic endpoint is should be called to initiate a payment flow after an order has been created. The details of the payment flow can differ depending on the payment integration and might require calling additional operations or the setup of webhooks.
     *
     * The endpoint internally calls the payment handler of the payment method currently set for the order.
     * @param requestBody
     * @returns any Redirect to external payment provider
     * @throws ApiError
     */
    public static handlePaymentMethod(
        requestBody: {
            /**
             * Identifier of an order
             */
            orderId: string;
            /**
             * URL to which the client should be redirected after successful payment
             */
            finishUrl?: string;
            /**
             * URL to which the client should be redirected after erroneous payment
             */
            errorUrl?: string;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/handle-payment',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Fetch shipping methods
     * Perform a filtered search for shipping methods.
     * @param onlyAvailable List only available shipping methods. This filters shipping methods methods which can not be used in the actual context because of their availability rule.
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static readShippingMethod(
        onlyAvailable?: boolean,
        requestBody?: Criteria,
    ): CancelablePromise<{
        /**
         * Total amount
         */
        total?: number;
        /**
         * aggregation result
         */
        aggregations?: any;
        elements?: Array<ShippingMethod>;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/shipping-method',
            query: {
                'onlyAvailable': onlyAvailable,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
