/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiRequestOptions } from './ApiRequestOptions';
import type { ApiResult } from './ApiResult';

export class ApiError extends Error {
    public readonly url: string;
    public readonly statusCode: number;
    public readonly statusMessage: string;
    public readonly body: any;
    public readonly response: any;
    public readonly request: ApiRequestOptions;

    constructor(request: ApiRequestOptions, response: ApiResult, message: string) {
        super(message);

        this.name = 'ApiError';
        this.url = response.url;
        this.statusCode = response.status;
        this.statusMessage = response.statusText;
        // @ts-ignore
        this.body = response._data.errors;
        this.response = response;
        this.request = request;
    }
}
