/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Criteria } from '../models/Criteria';
import type { PaymentMethod } from '../models/PaymentMethod';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PaymentMethodShopware {
    /**
     * Loads all available payment methods
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static readPaymentMethod(
        requestBody: (Criteria & {
            /**
             * List only available
             */
            onlyAvailable?: boolean;
        }),
    ): CancelablePromise<{
        /**
         * Total amount
         */
        total?: number;
        /**
         * aggregation result
         */
        aggregations?: Record<string, any>;
        elements?: Array<PaymentMethod>;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/payment-method',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
