/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Criteria } from '../models/Criteria';
import type { Document } from '../models/Document';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DocumentShopware {

    /**
     * Download generated document
     * Returns blob file of a generated document to download.
     * @param documentId
     * @param deepLinkCode
     * @param requestBody
     * @returns Document Returns the document information and blob to download.
     * @throws ApiError
     */
    public static download(
        documentId: string,
        deepLinkCode: string,
        requestBody?: Criteria,
    ): CancelablePromise<Document> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/document/download/{documentId}/{deepLinkCode}',
            path: {
                'documentId': documentId,
                'deepLinkCode': deepLinkCode,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
