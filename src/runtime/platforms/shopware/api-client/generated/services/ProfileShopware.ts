/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Criteria } from '../models/Criteria';
import type { Customer } from '../models/Customer';
import type { SuccessResponse } from '../models/SuccessResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ProfileShopware {

    /**
     * Change the customer's information
     * Make changes to a customer's account, like changing their name, salutation or title.
     * @param requestBody
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @returns SuccessResponse Returns a success response indicating a successful update
     * @throws ApiError
     */
    public static changeProfile(
        requestBody: {
            /**
             * Id of the salutation for the customer account. Fetch options using `salutation` endpoint.
             */
            salutationId: string;
            /**
             * (Academic) title of the customer
             */
            title?: string;
            /**
             * Customer first name. Value will be reused for shipping and billing address if not provided explicitly.
             */
            firstName: string;
            /**
             * Customer last name. Value will be reused for shipping and billing address if not provided explicitly.
             */
            lastName: string;
            /**
             * Company of the customer. Only required when `accountType` is `business`.
             */
            company?: string;
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
        },
        contentType: string = 'application/json',
        accept: string = 'application/json',
    ): CancelablePromise<SuccessResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/account/change-profile',
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Change the customer's email address
     * Changes a customer's email address to a new email address, using their current password as a validation.
     * @param requestBody
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @returns SuccessResponse Returns a success response indicating a successful update
     * @throws ApiError
     */
    public static changeEmail(
        requestBody: {
            /**
             * New email address. Has to be unique amongst all customers
             */
            email: string;
            /**
             * Confirmation of the new email address.
             */
            emailConfirmation: string;
            /**
             * Customer's current password
             */
            password: string;
        },
        contentType: string = 'application/json',
        accept: string = 'application/json',
    ): CancelablePromise<SuccessResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/account/change-email',
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Change the customer's password
     * Changes a customer's password using their current password as a validation.
     * @param requestBody
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @returns SuccessResponse Returns a success response indicating a successful update.
     * @throws ApiError
     */
    public static changePassword(
        requestBody: {
            /**
             * Current password of the customer
             */
            password: string;
            /**
             * New Password for the customer
             */
            newPassword: string;
            /**
             * Confirmation of the new password
             */
            newPasswordConfirm: string;
        },
        contentType: string = 'application/json',
        accept: string = 'application/json',
    ): CancelablePromise<SuccessResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/account/change-password',
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Change the customer's default payment method
     * Changes a customer's default (preselected) payment method.
     * @param paymentMethodId Identifier of the desired default payment method
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @returns SuccessResponse Returns a success response indicating a successful update.
     * @throws ApiError
     */
    public static changePaymentMethod(
        paymentMethodId: string,
        contentType: string = 'application/json',
        accept: string = 'application/json',
    ): CancelablePromise<SuccessResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/account/change-payment-method/{paymentMethodId}',
            path: {
                'paymentMethodId': paymentMethodId,
            },
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
        });
    }

    /**
     * Get information about current customer
     * Returns information about the current customer.
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @param requestBody
     * @returns Customer Returns the logged in customer, also for guest sessions. Check for the value of `guest` field to see whether the customer is a guest.
     * @throws ApiError
     */
    public static readCustomer(
        contentType: string = 'application/json',
        accept: string = 'application/json',
        requestBody?: Criteria,
    ): CancelablePromise<Customer> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/account/customer',
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Delete the customer's profile
     * Deletes a customer profile along with their addresses, wishlists and associated data. Created orders and their payment/shipping information (addresses) and reviews are not deleted.
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @returns void
     * @throws ApiError
     */
    public static deleteCustomer(
        contentType: string = 'application/json',
        accept: string = 'application/json',
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/account/customer',
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
        });
    }

    /**
     * Reset a password with recovery credentials
     * This operation is Step 2 of the password reset flow. It is required to conduct Step 1 "Send a password recovery mail" in order to obtain the required credentials for this step.
     *
     * Resets a customer's password using credentials from a password recovery mail as a validation.
     * @param requestBody
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @returns SuccessResponse Returns a success response indicating a successful update.
     * @throws ApiError
     */
    public static recoveryPassword(
        requestBody: {
            /**
             * Parameter from the link in the confirmation mail sent in Step 1
             */
            hash: string;
            /**
             * New password for the customer
             */
            newPassword: string;
            /**
             * Confirmation of the new password
             */
            newPasswordConfirm: string;
        },
        contentType: string = 'application/json',
        accept: string = 'application/json',
    ): CancelablePromise<SuccessResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/account/recovery-password-confirm',
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Send a password recovery mail
     * This operation is Step 1 of the password reset flow. Make sure to implement Step 2 "Reset password with recovery credentials" in order to allow for the complete flow in your application
     *
     * Sends a recovery mail containing a link with credentials that allows a customer to reset their password.
     * @param requestBody
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @returns SuccessResponse If email corresponds to an existing customer, a mail will be sent out to that customer containing a link assembled using the following schema:
     *
     * Returns a success indicating a successful initialisation of the reset flow.
     * @throws ApiError
     */
    public static sendRecoveryMail(
        requestBody: {
            /**
             * E-Mail address to identify the customer
             */
            email: string;
            /**
             * URL of the storefront to use for the generated reset link. It has to be a domain that is configured in the sales channel domain settings.
             */
            storefrontUrl: string;
        },
        contentType: string = 'application/json',
        accept: string = 'application/json',
    ): CancelablePromise<SuccessResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/account/recovery-password',
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
