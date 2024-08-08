/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CmsPage } from '../models/CmsPage';
import type { Criteria } from '../models/Criteria';
import type { LandingPage } from '../models/LandingPage';
import type { Media } from '../models/Media';
import type { ProductListingCriteria } from '../models/ProductListingCriteria';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ContentShopware {
    /**
     * Fetch and resolve Media Entities
     * Fetch one or multiple Media Entities with the corresponding Identifier.
     * @param requestBody
     * @returns Media The loaded MediaCollection containing the requested Media Entities.
     * @throws ApiError
     */
    public static readMedia(
        requestBody?: {
            /**
             * Identifier (UUID) of the media entity to be fetched.
             */
            ids: Array<string>;
        },
    ): CancelablePromise<Array<Media>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/media',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Not Found`,
            },
        });
    }
    /**
     * Fetch and resolve a CMS page
     * Loads a content management page by its identifier and resolve the slot data. This could be media files, product listing and so on.
     *
     * **Important notice**
     *
     * The criteria passed with this route also affects the listing, if there is one within the cms page.
     * @param id Identifier of the CMS page to be resolved
     * @param requestBody
     * @returns CmsPage The loaded cms page
     * @throws ApiError
     */
    public static readCms(
        id: string,
        requestBody?: ({
            /**
             * Resolves only the given slot identifiers. The identifiers have to be seperated by a `|` character.
             */
            slots?: string;
        } & ProductListingCriteria),
    ): CancelablePromise<CmsPage> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/cms/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Not Found`,
            },
        });
    }
    /**
     * Submit a contact form message
     * Used for submitting contact forms. Be aware that there can be more required fields, depending on the system settings.
     * @param requestBody
     * @returns any Message sent successful.
     * @throws ApiError
     */
    public static sendContactMail(
        requestBody: {
            /**
             * Identifier of the salutation. Use `/api/salutation` endpoint to fetch possible values.
             */
            salutationId: string;
            /**
             * Firstname. This field may be required depending on the system settings.
             */
            firstName?: string;
            /**
             * Lastname. This field may be required depending on the system settings.
             */
            lastName?: string;
            /**
             * Email address
             */
            email: string;
            /**
             * Phone. This field may be required depending on the system settings.
             */
            phone?: string;
            /**
             * The subject of the contact form.
             */
            subject: string;
            /**
             * The message of the contact form
             */
            comment: string;
            /**
             * Identifier of the navigation page. Can be used to override the configuration.
             * Take a look at the settings of a category containing a concact form in the administration.
             */
            navigationId?: string;
            /**
             * Identifier of the cms element
             */
            slotId?: string;
            /**
             * Type of the content management page
             */
            cmsPageType?: string;
            /**
             * Entity name for slot config
             */
            entityName?: string;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/contact-form',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Fetch a landing page with the resolved CMS page
     * Loads a landing page by its identifier and resolves the CMS page.
     *
     * **Important notice**
     *
     * The criteria passed with this route also affects the listing, if there is one within the cms page.
     * @param landingPageId Identifier of the landing page.
     * @param requestBody
     * @returns LandingPage The loaded landing page with cms page
     * @throws ApiError
     */
    public static readLandingPage(
        landingPageId: string,
        requestBody?: (Criteria & ({
            /**
             * Resolves only the given slot identifiers. The identifiers have to be seperated by a `|` character.
             */
            slots?: string;
        } & ProductListingCriteria)),
    ): CancelablePromise<LandingPage> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/landing-page/{landingPageId}',
            path: {
                'landingPageId': landingPageId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Not Found`,
            },
        });
    }
}
