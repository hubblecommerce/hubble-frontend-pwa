/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class KlarnaPaymentShopware {

    /**
     * [DMF] create klarna session
     * Create klarna Session for the current user.
     * @param swContextToken Context token for the current user
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @returns any Returns a JsonApiResponse with the klarna session.
     * @throws ApiError
     */
    public static createKlarnaSessionRoute(
        swContextToken: string,
        contentType: string = 'application/json',
        accept: string = 'application/json',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/dmf/klarna/createKlarnaSession',
            headers: {
                'sw-context-token': swContextToken,
                'Content-Type': contentType,
                'Accept': accept,
            },
            errors: {
                400: `Cart is empty error.`,
            },
        });
    }

    /**
     * [DMF] get customer data for the current klarna session.
     * Returns the customer data based on the current klarna session.
     * @param swContextToken Context token for the a logged in user.
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @returns any Returns a JsonApiResponse with the klarana session data extension.
     * @throws ApiError
     */
    public static getCustomerData(
        swContextToken: string,
        contentType: string = 'application/json',
        accept: string = 'application/json',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/dmf/klarna/getCustomerData',
            headers: {
                'sw-context-token': swContextToken,
                'Content-Type': contentType,
                'Accept': accept,
            },
            errors: {
                400: `Cart is empty error.`,
            },
        });
    }

}
