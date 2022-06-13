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
    customFields?: any;
    readonly createdAt: string;
    readonly updatedAt?: string;
    translated?: any;
    mailTemplateType?: MailTemplateType;
    media?: MailTemplateMedia;
};

