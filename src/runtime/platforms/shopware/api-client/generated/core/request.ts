/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
// @ts-ignore
import { ApiError } from './ApiError';
// @ts-ignore
import type { ApiRequestOptions } from './ApiRequestOptions';
// @ts-ignore
import type { ApiResult } from './ApiResult';
// @ts-ignore
import { CancelablePromise } from './CancelablePromise';
// @ts-ignore
import type { OnCancel } from './CancelablePromise';
// @ts-ignore
import type { OpenAPIConfig } from './OpenAPI';
import { usePlatform } from '#imports'
// @ts-ignore
import { OpenAPI } from './OpenAPI'
import { useFetch, useNuxtApp } from '#app'
// @ts-ignore
import { getRequestCookie } from '@hubblecommerce/hubble/commons'
import { hash } from 'ohash'

const getUrl = (config: OpenAPIConfig, options: ApiRequestOptions): string => {
    const encoder = config.ENCODE_PATH || encodeURI;

    const path = options.url
        .replace('{api-version}', config.VERSION)
        .replace(/{(.*?)}/g, (substring: string, group: string) => {
            if (options.path?.hasOwnProperty(group)) {
                return encoder(String(options.path[group]));
            }
            return substring;
        });

    const url = `${config.BASE}${path}`;

    return url;
};

const catchErrorCodes = (options: ApiRequestOptions, result): void => {
    const response = result.response

    if (!response) {
        // @ts-ignore
        throw new Error(result);
    }

    const errors: Record<number, string> = {
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        500: 'Internal Server Error',
        502: 'Bad Gateway',
        503: 'Service Unavailable',
        ...options.errors,
    }

    let error = errors[response.status];

    if (error) {
        throw new ApiError(options, response, error);
    }

    if (!response.ok) {
        throw new ApiError(options, response, 'Generic Error');
    }
};

export const cachedRoutes = [
    '/pwa/page',
    '/navigation/'
]

/**
 * Request method
 * @param config The OpenAPI configuration object
 * @param options The request options from the service
 * @returns CancelablePromise<T>
 * @throws ApiError
 */
export const request = <T>(config: OpenAPIConfig, options: ApiRequestOptions): CancelablePromise<T> => {
    const app = useNuxtApp()
    const { apiUrl, apiAuthToken, sessionToken, setSessionToken } = usePlatform()

    let platformHeaders = {
        'sw-access-key': apiAuthToken,
        'sw-include-seo-urls': 'true'
    }

    if (process.server) {
        const sessionCookie = getRequestCookie(app, app.$config.public.sessionCookie.name)
        setSessionToken(sessionCookie)
    }

    if(sessionToken.value !== null) {
        platformHeaders['sw-context-token'] = sessionToken.value
    }

    OpenAPI.BASE = apiUrl
    OpenAPI.HEADERS = platformHeaders

    return new CancelablePromise(async (resolve, reject) => {
        try {
            const headers = Object.assign(config.HEADERS, options.headers)

            const { data, pending, refresh, error } = await useFetch(
                getUrl(config, options),
                {
                    method: options.method,
                    body: options.query && options.method !== 'GET' ? options.query : options.body,
                    headers: headers,
                    params: options.query && options.method === 'GET' ? options.query : null,
                    initialCache: cachedRoutes.includes(options.url),
                    key: hash(['api-fetch', getUrl(config, options), options.body, options.method]),
                    onRequest: async (ctx) => {
                        app.$hblBus.$emit('onRequest', { data: ctx })
                    },
                    onRequestError: async (ctx) => {
                        app.$hblBus.$emit('onRequestError', { data: ctx })
                    },
                    onResponse: async (ctx) => {
                        app.$hblBus.$emit('onResponse', { data: ctx })
                    },
                    onResponseError: async (ctx) => {
                        app.$hblBus.$emit('onResponseError', { data: ctx })
                    }
                }
            )

            // Client side error is only boolean,
            // so fetch again in case of client side and error to get response error code
            // https://github.com/nuxt/framework/issues/2122#issuecomment-979073727
            if (process.client && error.value) {
                await refresh()
            }

            if (error.value) {
                // @ts-ignore
                catchErrorCodes(options, error.value);
            }

            // @ts-ignore
            resolve({ data, pending, refresh })
        } catch (e) {
            reject(e);
        }
    })
};
