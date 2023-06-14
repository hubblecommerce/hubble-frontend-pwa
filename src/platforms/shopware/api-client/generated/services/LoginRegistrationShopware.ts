/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContextTokenResponse } from '../models/ContextTokenResponse';
import type { Customer } from '../models/Customer';
import type { CustomerAddress } from '../models/CustomerAddress';
import type { CustomerGroup } from '../models/CustomerGroup';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class LoginRegistrationShopware {

    /**
     * Log in a customer
     * Logs in customers given their credentials.
     * @param requestBody
     * @returns ContextTokenResponse A successful login returns a context token which is associated with the logged in user. Use that as your `sw-context-token` header for subsequent requests.
     * @throws ApiError
     */
    public static loginCustomer(
        requestBody: {
            /**
             * Email
             */
            username: string;
            /**
             * Password
             */
            password: string;
        },
    ): CancelablePromise<ContextTokenResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/account/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `If credentials are incorrect an error is returned`,
            },
        });
    }

    /**
     * Log out a customer
     * Logs out a customer.
     * @returns ContextTokenResponse A successful logout returns a context token for the anonymous user. Use that as your `sw-context-token` header for subsequent requests.
     * @throws ApiError
     */
    public static logoutCustomer(): CancelablePromise<ContextTokenResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/account/logout',
            errors: {
                403: `Forbidden`,
            },
        });
    }

    /**
     * Confirm a customer registration
     * Confirms a customer registration when double opt-in is activated.
     *
     * Learn more about double opt-in registration in our guide "Register a customer".
     * @param requestBody
     * @returns any Returns the logged in customer. The customer is automatically logged in with the `sw-context-token` header provided, which can be reused for subsequent requests.
     * @throws ApiError
     */
    public static registerConfirm(
        requestBody: {
            /**
             * Hash from the email received
             */
            hash: string;
            /**
             * Email hash from the email received
             */
            em: string;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/account/register-confirm',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `No hash provided`,
                412: `The customer has already been confirmed`,
            },
        });
    }

    /**
     * Register a customer
     * Registers a customer. Used both for normal customers and guest customers.See the Guide "Register a customer" for more information on customer registration.
     * @param requestBody
     * @returns Customer Success
     * @throws ApiError
     */
    public static register(
        requestBody: {
            /**
             * Email of the customer. Has to be unique, unless `guest` is `true`
             */
            email: string;
            /**
             * Password for the customer. Required, unless `guest` is `true`
             */
            password: string;
            /**
             * Id of the salutation for the customer account. Fetch options using `salutation` endpoint.
             */
            salutationId: string;
            /**
             * Customer first name. Value will be reused for shipping and billing address if not provided explicitly.
             */
            firstName: string;
            /**
             * Customer last name. Value will be reused for shipping and billing address if not provided explicitly.
             */
            lastName: string;
            /**
             * Flag indicating accepted data protection
             */
            acceptedDataProtection: boolean;
            /**
             * URL of the storefront for that registration. Used in confirmation emails. Has to be one of the configured domains of the sales channel.
             */
            storefrontUrl: string;
            billingAddress: CustomerAddress;
            shippingAddress?: CustomerAddress;
            /**
             * Account type of the customer which can be either `private` or `business`.
             */
            accountType?: string;
            /**
             * If set, will create a guest customer. Guest customers can re-use an email address and don't need a password.
             */
            guest?: boolean;
            /**
             * Birthday day
             */
            birthdayDay?: number;
            /**
             * Birthday month
             */
            birthdayMonth?: number;
            /**
             * Birthday year
             */
            birthdayYear?: number;
            /**
             * (Academic) title of the customer
             */
            title?: string;
            /**
             * Field can be used to store an affiliate tracking code
             */
            affiliateCode?: string;
            /**
             * Field can be used to store a campaign tracking code
             */
            campaignCode?: string;
        },
    ): CancelablePromise<Customer> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/account/register',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Fetch registration settings for customer group
     * @param customerGroupId Customer group id
     * @returns CustomerGroup Returns the customer group including registration settings.
     * @throws ApiError
     */
    public static getCustomerGroupRegistrationInfo(
        customerGroupId: string,
    ): CancelablePromise<CustomerGroup> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/customer-group-registration/config/{customerGroupId}',
            path: {
                'customerGroupId': customerGroupId,
            },
        });
    }

}
