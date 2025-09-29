import { ref, type Ref } from 'vue'
// @ts-ignore
import { type HblIUseNotification, type HblNotificationOptions, type HblNotification } from '#layers/hubble/types'

const notifications: Ref<HblNotification[]> = ref([])
let notificationDefaultDisplayTime = 5
let notificationsDefaultKeepAlive = false
let notificationsDefaultType = 'info'
let notificationCounter = 0

export function useNotification (): HblIUseNotification {
    const additionalRef = ref('overridden component value')

    function setDefaultOptions (options: HblNotificationOptions) {
        notificationDefaultDisplayTime = options.displayTime != null ? options.displayTime : notificationDefaultDisplayTime
        notificationsDefaultKeepAlive = options.keepAlive != null ? options.keepAlive : notificationsDefaultKeepAlive
        notificationsDefaultType = options.type != null ? options.type : notificationsDefaultType
    }

    function showNotification (
        message: string,
        type = notificationsDefaultType,
        keepAlive = notificationsDefaultKeepAlive,
        displayTime = notificationDefaultDisplayTime
    ): void {
        const notification: HblNotification = {
            id: notificationCounter,
            message,
            displayTime,
            keepAlive,
            type
        }

        notifications.value.push(notification)

        if (!notification.keepAlive) {
            setTimeout(() => {
                closeNotification(notification.id)
            }, notification.displayTime != null ? notification.displayTime * 1000 : 1000)
        }

        notificationCounter++
    }

    function closeNotification (id: number): void {
        notifications.value = notifications.value.filter((item) => {
            return item.id !== id
        })
    }

    return {
        notifications,
        showNotification,
        closeNotification,
        setDefaultOptions,
        additionalRef
    }
}
