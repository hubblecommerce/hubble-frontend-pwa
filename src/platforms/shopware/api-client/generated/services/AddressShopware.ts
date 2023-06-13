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
     * @returns void
     * @throws ApiError
     */
    public static deleteCustomerAddress(
        addressId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/account/address/{addressId}',
            path: {
                'addressId': addressId,
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
     * @param requestBody
     * @returns CustomerAddress
     * @throws ApiError
     */
    public static updateCustomerAddress(
        addressId: string,
        requestBody?: CustomerAddress,
    ): CancelablePromise<CustomerAddress> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/account/address/{addressId}',
            path: {
                'addressId': addressId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Fetch addresses of a customer
     * Lists all addresses of the current customer and allows filtering them based on a criteria.
     * @param requestBody
     * @returns CustomerAddress
     * @throws ApiError
     */
    public static listAddress(
        requestBody?: Criteria,
    ): CancelablePromise<Array<CustomerAddress>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/account/list-address',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Change a customer's default shipping address
     * Updates the default (preselected) shipping addresses of a customer.
     * @param addressId Address ID
     * @returns any
     * @throws ApiError
     */
    public static defaultShippingAddress(
        addressId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/account/address/default-shipping/{addressId}',
            path: {
                'addressId': addressId,
            },
        });
    }

    /**
     * Change a customer's default billing address
     * Updates the default (preselected) billing addresses of a customer.
     * @param addressId Address ID
     * @returns any
     * @throws ApiError
     */
    public static defaultBillingAddress(
        addressId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/account/address/default-billing/{addressId}',
            path: {
                'addressId': addressId,
            },
        });
    }

    /**
     * Create a new address for a customer
     * Creates a new address for a customer.
     * @param requestBody
     * @returns CustomerAddress
     * @throws ApiError
     */
    public static createCustomerAddress(
        requestBody?: CustomerAddress,
    ): CancelablePromise<CustomerAddress> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/account/address',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
