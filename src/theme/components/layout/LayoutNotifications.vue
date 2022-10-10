<template>
    <div class="toast toast-bottom toast-end w-full md:w-auto" style="z-index: 1000">
        <Transition name="fade">
            <TransitionGroup v-if="notifications.length > 0" name="list" tag="div" class="relative">
                <div v-for="notification in notifications" :key="notification.id" class="alert mb-2 relative" :class="parseTypeClass(notification.type)">
                    <div class="pr-12">
                        <span>{{ notification.message }}</span>
                        <span class="btn btn-ghost btn-circle absolute top-1 right-1" @click="closeNotification(notification.id)">
                            <XMarkIcon class="h-5 w-5" />
                        </span>
                    </div>
                </div>
            </TransitionGroup>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { useNotification } from '#imports'

const { notifications, closeNotification, setDefaultOptions } = useNotification()

setDefaultOptions({
    displayTime: 4,
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

<style lang="scss" scoped>
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
}

.list-leave-active {
    position: absolute;
}
</style>
