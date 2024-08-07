/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AppSystemShopware {
    /**
     * Generate JWT token for app system backend
     * Generate JWT token for authenticated communication with the app server
     * @param name Name of the app
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static generateJwtAppSystemAppServer(
        name: string,
        requestBody?: Record<string, any>,
    ): CancelablePromise<{
        token?: string;
        expires?: string;
        shopId?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/app-system/{name}/generate-token',
            path: {
                'name': name,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
