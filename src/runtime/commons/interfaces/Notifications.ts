import { Ref } from 'vue'

export type NotificationType = string | 'info' | 'success' | 'warning' | 'error'

export interface NotificationOptions {
    displayTime?: number,
    keepAlive?: boolean,
    type?: NotificationType
}

export interface Notification extends NotificationOptions {
    id: number,
    message: string
}

export interface IUseNotification {
    notifications: Ref<Notification[]>,
    showNotification(message: string, type?: NotificationType, keepAlive?: boolean, displayTime?: number): void,
    closeNotification(id: number): void,
    setDefaultOptions(options: NotificationOptions): void
}
