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
import { throwError, useFetch, useNuxtApp } from '#app'
// @ts-ignore
import { getRequestCookie } from '../../../../../commons'

const isDefined = <T>(value: T | null | undefined): value is Exclude<T, null | undefined> => {
    return value !== undefined && value !== null;
};

const isString = (value: any): value is string => {
    return typeof value === 'string';
};

const isStringWithValue = (value: any): value is string => {
    return isString(value) && value !== '';
};

const isBlob = (value: any): value is Blob => {
    return (
        typeof value === 'object' &&
        typeof value.type === 'string' &&
        typeof value.stream === 'function' &&
        typeof value.arrayBuffer === 'function' &&
        typeof value.constructor === 'function' &&
        typeof value.constructor.name === 'string' &&
        /^(Blob|File)$/.test(value.constructor.name) &&
        /^(Blob|File)$/.test(value[Symbol.toStringTag])
    );
};

const isFormData = (value: any): value is FormData => {
    return value instanceof FormData;
};

const base64 = (str: string): string => {
    try {
        return btoa(str);
    } catch (err) {
        // @ts-ignore
        return Buffer.from(str).toString('base64');
    }
};

const getQueryString = (params: Record<string, any>): string => {
    const qs: string[] = [];

    const append = (key: string, value: any) => {
        qs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    };

    const process = (key: string, value: any) => {
        if (isDefined(value)) {
            if (Array.isArray(value)) {
                value.forEach(v => {
                    process(key, v);
                });
            } else if (typeof value === 'object') {
                Object.entries(value).forEach(([k, v]) => {
                    process(`${key}[${k}]`, v);
                });
            } else {
                append(key, value);
            }
        }
    };

    Object.entries(params).forEach(([key, value]) => {
        process(key, value);
    });

    if (qs.length > 0) {
        return `?${qs.join('&')}`;
    }

    return '';
};

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
    if (options.query) {
        return `${url}${getQueryString(options.query)}`;
    }
    return url;
};

const getFormData = (options: ApiRequestOptions): FormData | undefined => {
    if (options.formData) {
        const formData = new FormData();

        const process = (key: string, value: any) => {
            if (isString(value) || isBlob(value)) {
                formData.append(key, value);
            } else {
                formData.append(key, JSON.stringify(value));
            }
        };

        Object.entries(options.formData)
            .filter(([_, value]) => isDefined(value))
            .forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach(v => process(key, v));
                } else {
                    process(key, value);
                }
            });

        return formData;
    }
    return undefined;
};

type Resolver<T> = (options: ApiRequestOptions) => Promise<T>;

const resolve = async <T>(options: ApiRequestOptions, resolver?: T | Resolver<T>): Promise<T | undefined> => {
    if (typeof resolver === 'function') {
        return (resolver as Resolver<T>)(options);
    }
    return resolver;
};

const getHeaders = (config: OpenAPIConfig, options: ApiRequestOptions): Headers => {
    const token = resolve(options, config.TOKEN);
    const username = resolve(options, config.USERNAME);
    const password = resolve(options, config.PASSWORD);
    const additionalHeaders = resolve(options, config.HEADERS);

    const headers = Object.entries({
        Accept: 'application/json',
        ...additionalHeaders,
        ...options.headers,
    })
        .filter(([_, value]) => isDefined(value))
        .reduce((headers, [key, value]) => ({
            ...headers,
            [key]: String(value),
        }), {} as Record<string, string>);

    if (isStringWithValue(token)) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    if (isStringWithValue(username) && isStringWithValue(password)) {
        const credentials = base64(`${username}:${password}`);
        headers['Authorization'] = `Basic ${credentials}`;
    }

    if (options.body) {
        if (options.mediaType) {
            headers['Content-Type'] = options.mediaType;
        } else if (isBlob(options.body)) {
            headers['Content-Type'] = options.body.type || 'application/octet-stream';
        } else if (isString(options.body)) {
            headers['Content-Type'] = 'text/plain';
        } else if (!isFormData(options.body)) {
            headers['Content-Type'] = 'application/json';
        }
    }

    return new Headers(headers);
};

const getRequestBody = (options: ApiRequestOptions): any => {
    if (options.body) {
        if (options.mediaType?.includes('/json')) {
            return JSON.stringify(options.body)
        } else if (isString(options.body) || isBlob(options.body) || isFormData(options.body)) {
            return options.body;
        } else {
            return JSON.stringify(options.body);
        }
    }
    return undefined;
};

export const sendRequest = async (
    config: OpenAPIConfig,
    options: ApiRequestOptions,
    url: string,
    body: any,
    formData: FormData | undefined,
    headers: Headers,
    onCancel: OnCancel
): Promise<Response> => {
    const controller = new AbortController();

    const request: RequestInit = {
        headers,
        body: body ?? formData,
        method: options.method,
        signal: controller.signal,
    };

    if (config.WITH_CREDENTIALS) {
        request.credentials = config.CREDENTIALS;
    }

    onCancel(() => controller.abort());

    return await fetch(url, request).catch((error) => {
        throwError('Network error')
        return error
    });
};

const getResponseHeader = (response: Response, responseHeader?: string): string | undefined => {
    if (responseHeader) {
        const content = response.headers.get(responseHeader);
        if (isString(content)) {
            return content;
        }
    }
    return undefined;
};

const getResponseBody = async (response: Response): Promise<any> => {
    if (response.status !== 204) {
        try {
            const contentType = response.headers.get('Content-Type');
            if (contentType) {
                const isJSON = contentType.toLowerCase().startsWith('application/json');
                if (isJSON) {
                    return await response.json();
                } else {
                    return await response.text();
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
    return undefined;
};

const catchErrorCodes = (options: ApiRequestOptions, result: ApiResult): void => {
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

    let error = errors[result.status];

    const resultError = result.body?.errors?.find(element => element.status === result.status.toString())
    if(resultError?.detail != null) {
        error = resultError.detail
    }

    if (error) {
        throw new ApiError(options, result, error);
    }

    if (!result.ok) {
        throw new ApiError(options, result, 'Generic Error');
    }
};

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
        'sw-access-key': apiAuthToken
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
                    body: options.body,
                    headers: headers
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
                catchErrorCodes(options, error.value.response);
            }

            // @ts-ignore
            resolve({ data, pending, refresh })
        } catch (e) {
            reject(e);
        }
    })
};
