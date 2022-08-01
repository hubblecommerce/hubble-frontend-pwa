/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DocumentType } from './DocumentType';
import type { Media } from './Media';
import type { Order } from './Order';

/**
 * Added since version: 6.0.0.0
 */
export type Document = {
    id?: string;
    documentTypeId: string;
    fileType: string;
    referencedDocumentId?: string;
    orderId: string;
    documentMediaFileId?: string;
    orderVersionId?: string;
    config: any;
    sent?: boolean;
    static?: boolean;
    deepLinkCode: string;
    customFields?: any;
    readonly createdAt: string;
    readonly updatedAt?: string;
    documentType?: DocumentType;
    order?: Order;
    referencedDocument?: Document;
    dependentDocuments?: Document;
    documentMediaFile?: Media;
};

