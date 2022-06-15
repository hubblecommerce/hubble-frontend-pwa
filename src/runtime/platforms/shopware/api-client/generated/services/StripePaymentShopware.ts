/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContextTokenResponse } from '../models/ContextTokenResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class StripePaymentShopware {

    /**
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @returns ContextTokenResponse Context
     * @throws ApiError
     */
    public static updateStripePaymentMethodSettings(
        contentType: string = 'application/json',
        accept: string = 'application/json',
    ): CancelablePromise<ContextTokenResponse> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/store-api/stripe-payment/payment-method-settings',
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
        });
    }

}
