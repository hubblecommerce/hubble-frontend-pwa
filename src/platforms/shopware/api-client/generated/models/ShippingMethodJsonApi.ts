/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { resource } from './resource';
/**
 * Added since version: 6.0.0.0
 */
export type ShippingMethodJsonApi = (resource & {
    id: string;
    name: string;
    active?: boolean;
    position?: number;
    customFields?: Record<string, any>;
    mediaId?: string;
    deliveryTimeId: string;
    taxType: string;
    description?: string;
    trackingUrl?: string;
    technicalName?: string;
    readonly createdAt: string;
    readonly updatedAt?: string;
    translated?: Record<string, any>;
    relationships?: {
        deliveryTime?: {
            links?: {
                related?: string;
            };
            data?: {
                type?: string;
                id?: string;
            };
        };
        availabilityRule?: {
            links?: {
                related?: string;
            };
            data?: {
                type?: string;
                id?: string;
            };
        };
        prices?: {
            links?: {
                related?: string;
            };
            data?: Array<{
                type?: string;
                id?: string;
            }>;
        };
        media?: {
            links?: {
                related?: string;
            };
            data?: {
                type?: string;
                id?: string;
            };
        };
        tags?: {
            links?: {
                related?: string;
            };
            data?: Array<{
                type?: string;
                id?: string;
            }>;
        };
        tax?: {
            links?: {
                related?: string;
            };
            data?: {
                type?: string;
                id?: string;
            };
        };
    };
});

