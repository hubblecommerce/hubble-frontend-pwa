/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MailTemplateMedia } from './MailTemplateMedia';
import type { MailTemplateType } from './MailTemplateType';
/**
 * Added since version: 6.0.0.0
 */
export type MailTemplate = {
    id?: string;
    systemDefault?: boolean;
    senderName?: string;
    contentHtml: string;
    contentPlain: string;
    customFields?: Record<string, any>;
    readonly createdAt: string;
    readonly updatedAt?: string;
    translated?: Record<string, any>;
    mailTemplateType?: MailTemplateType;
    media?: Array<MailTemplateMedia>;
};

