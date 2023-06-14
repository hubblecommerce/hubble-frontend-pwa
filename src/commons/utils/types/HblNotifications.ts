import { Ref } from 'vue'

export type HblNotificationType = string | 'info' | 'success' | 'warning' | 'error'

export interface HblNotificationOptions {
    displayTime?: number,
    keepAlive?: boolean,
    type?: HblNotificationType
}

export interface HblNotification extends HblNotificationOptions {
    id: number,
    message: string
}

export interface HblIUseNotification {
    notifications: Ref<HblNotification[]>,
    showNotification(message: string, type?: HblNotificationType, keepAlive?: boolean, displayTime?: number): void,
    closeNotification(id: number): void,
    setDefaultOptions(options: HblNotificationOptions): void
}
