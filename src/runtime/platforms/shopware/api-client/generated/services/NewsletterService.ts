/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class NewsletterService {

    /**
     * Confirm a newsletter registration
     * You have to use the hash from the link sent out via email to confirm the user registration.
     * @param requestBody
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @returns any The newsletter confirmation was successful.
     * @throws ApiError
     */
    public static confirmNewsletter(
        requestBody: {
            /**
             * Hash parameter from link the in the confirmation mail
             */
            hash: string;
            /**
             * Email hash parameter from the link in the confirmation mail
             */
            em: string;
        },
        contentType: string = 'application/json',
        accept: string = 'application/json',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/newsletter/confirm',
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Create or remove a newsletter subscription
     * This route is used to create/remove/confirm a newsletter subscription.
     *
     * The `option` property controls what should happen:
     * * `direct`: The subscription is directly active and does not need a confirmation.
     * * `subscribe`: An email will be send to the provided email addrees containing a link to the /newsletter/confirm route.
     * The subscription is only successful, if the /newsletter/confirm route is called with the generated hashes.
     * * `unsubscribe`: The email address will be removed from the newsletter subscriptions.
     * * `confirmSubscribe`: Confirmes the newsletter subscription for the provided email address.
     * @param requestBody
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @returns any Success
     * @throws ApiError
     */
    public static subscribeToNewsletter(
        requestBody: {
            /**
             * Email address that will receive the confirmation and the newsletter.
             */
            email: string;
            /**
             * Defines what should be done.
             */
            option: any;
            /**
             * Url of the storefront of the shop. This will be used for generating the link to the /newsletter/confirm inside the confirm email.
             */
            storefrontUrl: string;
            /**
             * Identifier of the salutation.
             */
            salutationId?: any;
            /**
             * First name
             */
            firstName?: string;
            /**
             * Last name
             */
            lastName?: string;
            /**
             * Street
             */
            street?: string;
            /**
             * City
             */
            city?: string;
            /**
             * Zip code
             */
            zipCode?: string;
            /**
             * Zip code
             */
            tags?: string;
            /**
             * Identifier of the language.
             */
            languageId?: any;
            /**
             * Custom field data that should be added to the subscription.
             */
            customFields?: string;
        },
        contentType: string = 'application/json',
        accept: string = 'application/json',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/newsletter/subscribe',
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Remove a newsletter subscription
     * Removes a newsletter recipient from the mailing lists.
     * @param requestBody
     * @param contentType Content type of the request
     * @param accept Accepted response content types
     * @returns any Unsubscribing was successful.
     * @throws ApiError
     */
    public static unsubscribeToNewsletter(
        requestBody: {
            /**
             * Email address that should be removed from the mailing lists.
             */
            email: string;
        },
        contentType: string = 'application/json',
        accept: string = 'application/json',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/newsletter/unsubscribe',
            headers: {
                'Content-Type': contentType,
                'Accept': accept,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
