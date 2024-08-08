/* generated using openapi-typescript-codegen -- do no edit */
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
    id: string;
    documentTypeId: string;
    fileType: string;
    referencedDocumentId?: string;
    orderId: string;
    documentMediaFileId?: string;
    orderVersionId?: string;
    config: {
        name: string;
        title: string;
    };
    sent?: boolean;
    static?: boolean;
    deepLinkCode: string;
    documentNumber?: string;
    customFields?: Record<string, any>;
    readonly createdAt: string;
    readonly updatedAt?: string;
    documentType?: DocumentType;
    order?: Order;
    referencedDocument?: Document;
    dependentDocuments?: Array<Document>;
    documentMediaFile?: Media;
};

