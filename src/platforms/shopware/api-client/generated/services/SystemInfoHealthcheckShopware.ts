/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SystemInfoHealthcheckShopware {
    /**
     * Get OpenAPI Specification
     * Get information about the store API in OpenAPI format.
     * @param type Type of the api
     * @returns any Returns information about the store API.
     * @throws ApiError
     */
    public static apiInfo(
        type?: 'jsonapi' | 'json',
    ): CancelablePromise<{
        openapi: string;
        info: {
            title: string;
            summary?: string;
            description?: string;
            termsOfService?: string;
            contact?: {
                name?: string;
                url?: string;
                email?: string;
            };
            license?: {
                name: string;
                identifier?: string;
                url?: string;
            };
            version: string;
        };
        jsonSchemaDialect?: string;
        webhooks?: Record<string, any>;
        servers?: Array<{
            url: string;
        }>;
        components?: {
            schemas?: Record<string, any>;
            responses?: Record<string, any>;
            parameters?: Record<string, any>;
            examples?: Record<string, any>;
            requestBodies?: Record<string, any>;
            headers?: Record<string, any>;
            securitySchemes?: Record<string, any>;
            links?: Record<string, any>;
            callbacks?: Record<string, any>;
            pathItems?: Record<string, any>;
        };
        security?: Array<Record<string, any>>;
        paths?: Record<string, any>;
        tags?: Array<{
            name: string;
            description?: string;
            externalDocs?: {
                description?: string;
                url: string;
            };
        }>;
        externalDocs?: {
            description?: string;
            url: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/_info/openapi3.json',
            query: {
                'type': type,
            },
        });
    }
}
