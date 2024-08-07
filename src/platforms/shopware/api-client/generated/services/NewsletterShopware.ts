/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccountNewsletterRecipientResult } from '../models/AccountNewsletterRecipientResult';
import type { Criteria } from '../models/Criteria';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class NewsletterShopware {
    /**
     * Fetch newsletter recipients
     * Perform a filtered search for newsletter recipients.
     * @param requestBody
     * @returns AccountNewsletterRecipientResult
     * @throws ApiError
     */
    public static readNewsletterRecipient(
        requestBody?: Criteria,
    ): CancelablePromise<Array<AccountNewsletterRecipientResult>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/account/newsletter-recipient',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Confirm a newsletter registration
     * You have to use the hash from the link sent out via email to confirm the user registration.
     * @param requestBody
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
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/newsletter/confirm',
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
            option: string;
            /**
             * Url of the storefront of the shop. This will be used for generating the link to the /newsletter/confirm inside the confirm email.
             */
            storefrontUrl: string;
            /**
             * Identifier of the salutation.
             */
            salutationId?: string;
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
            languageId?: string;
            /**
             * Custom field data that should be added to the subscription.
             */
            customFields?: string;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/newsletter/subscribe',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Remove a newsletter subscription
     * Removes a newsletter recipient from the mailing lists.
     * @param requestBody
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
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/newsletter/unsubscribe',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
