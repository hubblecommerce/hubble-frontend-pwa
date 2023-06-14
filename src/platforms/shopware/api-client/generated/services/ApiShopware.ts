/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ApiShopware {

    /**
     * Access point for different api logics which are provided by apps over script hooks
     * @param hook Dynamic hook which used to build the hook name
     * @returns any Returns different structures of results based on the called script.
     * @throws ApiError
     */
    public static postScriptStoreApiRoute(
        hook: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/script/{hook}',
            path: {
                'hook': hook,
            },
        });
    }

}
