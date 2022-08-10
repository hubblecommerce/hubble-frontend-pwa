<template>
    <div class="toast toast-bottom toast-end z-50">
        <Transition name="fade">
            <TransitionGroup v-if="notifications.length > 0" name="list" tag="div">
                <div v-for="notification in notifications" :key="notification.id" class="alert mb-2 relative" :class="parseTypeClass(notification.type)">
                    <div class="pr-12">
                        <span>{{ notification.message }}</span>
                        <span class="btn btn-ghost btn-circle absolute top-1 right-1" @click="closeNotification(notification.id)">
                            <XIcon class="h-5 w-5" />
                        </span>
                    </div>
                </div>
            </TransitionGroup>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { XIcon } from '@heroicons/vue/outline'
import { useNotification } from '#imports'

const { notifications, closeNotification, setDefaultOptions } = useNotification()

setDefaultOptions({
    displayTime: 7,
    keepAlive: false
})

const parseTypeClass = function (type) {
    if (type === 'info') {
        return 'alert-info'
    }

    if (type === 'success') {
        return 'alert-success'
    }

    if (type === 'warning') {
        return 'alert-warning'
    }

    if (type === 'error') {
        return 'alert-error'
    }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.list-move,
.list-enter-active,
.list-leave-active {
    transition: all 0.2s ease;
}
.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

.list-leave-active {
    position: absolute;
}
</style>
