/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AmazonPayShopware {

    /**
     * [DMF] create amazon pay button
     * Create a button extension to to visualize the button on the.
     * @param requestBody
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @returns any Returns a JsonApiResponse with the button provider from amazon pay.
     * @throws ApiError
     */
    public static getAmazonPayButton(
        requestBody: {
            /**
             * The return url.
             */
            checkoutReviewReturnUrl?: string;
            /**
             * Button extension placement.
             */
            placement?: string;
        },
        contentType: string = 'application/json',
        accept: string = 'application/json',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/amazon-pay/getAmazonPayButton',
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Parameter missing.`,
                412: `The amazon button extension failed.`,
            },
        });
    }

    /**
     * [DMF] amazon pay checkout review
     * Logs in the user as guest by the amazon pay checkout session.
     * @param requestBody
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @returns any Returns a response with the logged in customer.
     * @throws ApiError
     */
    public static oneClickCheckoutReview(
        requestBody: {
            /**
             * The amazon pay session id.
             */
            checkoutSessionId?: string;
        },
        contentType: string = 'application/json',
        accept: string = 'application/json',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/amazon-pay/oneClickCheckoutReview',
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Parameter missing.`,
            },
        });
    }

}
