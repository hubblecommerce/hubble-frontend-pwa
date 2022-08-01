/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Criteria } from '../models/Criteria';
import type { CustomerAddress } from '../models/CustomerAddress';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AddressShopware {

    /**
     * Delete an address of a customer
     * Delete an address of customer.
     *
     * Only addresses which are not set as default addresses for shipping or billing can be deleted. You can check the current default addresses of your customer using the profile information endpoint and change them using the default address endpoint.
     *
     * **A customer must have at least one address (which can be used for shipping and billing).**
     *
     * An automatic fallback is not applied.
     * @param addressId ID of the address to be deleted.
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @returns void
     * @throws ApiError
     */
    public static deleteCustomerAddress(
        addressId: string,
        contentType: string = 'application/json',
        accept: string = 'application/json',
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/account/address/{addressId}',
            path: {
                'addressId': addressId,
            },
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            errors: {
                400: `Response containing a list of errors, most likely due to the address being in use`,
            },
        });
    }

    /**
     * Modify an address of a customer
     * Modifies an existing address of a customer.
     * @param addressId Address ID
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @param requestBody
     * @returns CustomerAddress
     * @throws ApiError
     */
    public static updateCustomerAddress(
        addressId: string,
        contentType: string = 'application/json',
        accept: string = 'application/json',
        requestBody?: CustomerAddress,
    ): CancelablePromise<CustomerAddress> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/account/address/{addressId}',
            path: {
                'addressId': addressId,
            },
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Fetch addresses of a customer
     * Lists all addresses of the current customer and allows filtering them based on a criteria.
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @param requestBody
     * @returns CustomerAddress
     * @throws ApiError
     */
    public static listAddress(
        contentType: string = 'application/json',
        accept: string = 'application/json',
        requestBody?: Criteria,
    ): CancelablePromise<Array<CustomerAddress>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/account/list-address',
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Change a customer's default shipping address
     * Updates the default (preselected) shipping addresses of a customer.
     * @param addressId Address ID
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @returns any
     * @throws ApiError
     */
    public static defaultShippingAddress(
        addressId: string,
        contentType: string = 'application/json',
        accept: string = 'application/json',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/account/address/default-shipping/{addressId}',
            path: {
                'addressId': addressId,
            },
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
        });
    }

    /**
     * Change a customer's default billing address
     * Updates the default (preselected) billing addresses of a customer.
     * @param addressId Address ID
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @returns any
     * @throws ApiError
     */
    public static defaultBillingAddress(
        addressId: string,
        contentType: string = 'application/json',
        accept: string = 'application/json',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/account/address/default-billing/{addressId}',
            path: {
                'addressId': addressId,
            },
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
        });
    }

    /**
     * Create a new address for a customer
     * Creates a new address for a customer.
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @param requestBody
     * @returns CustomerAddress
     * @throws ApiError
     */
    public static createCustomerAddress(
        contentType: string = 'application/json',
        accept: string = 'application/json',
        requestBody?: CustomerAddress,
    ): CancelablePromise<CustomerAddress> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/account/address',
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
