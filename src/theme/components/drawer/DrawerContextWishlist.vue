<template>
    <div class="flex flex-col gap-4">
        <div class="flex justify-between items-center">
            <div class="text-2xl">
                Wishlist
            </div>

            <div class="btn btn-ghost btn-circle" @click="closeDrawer">
                <XMarkIcon class="w-5 h-5" />
            </div>
        </div>
        <Wishlist />
    </div>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { useDrawer } from '#imports'

const { closeDrawer } = useDrawer()
</script>

<style lang="postcss">
.fade-enter-active,
.fade-leave-active {
    transition: all 0.1s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
