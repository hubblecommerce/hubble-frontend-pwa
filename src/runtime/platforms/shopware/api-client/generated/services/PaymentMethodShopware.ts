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
     * @param contentType Content type of the request
     * @param accept Accepted response content types
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
        contentType: string = 'application/json',
        accept: string = 'application/json',
    ): CancelablePromise<{
        /**
         * Total amount
         */
        total?: number;
        /**
         * aggregation result
         */
        aggregations?: any;
        elements?: Array<PaymentMethod>;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/payment-method',
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
