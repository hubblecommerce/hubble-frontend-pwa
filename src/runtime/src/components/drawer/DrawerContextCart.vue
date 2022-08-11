<template>
    <div class="flex flex-col gap-4">
        <div class="flex justify-between items-center">
            <div class="text-2xl">
                Cart
            </div>

            <div class="btn btn-ghost btn-circle" @click="closeDrawer">
                <XIcon class="w-5 h-5" />
            </div>
        </div>
        <Cart />
    </div>
</template>

<script setup lang="ts">
import { XIcon } from '@heroicons/vue/outline'
import { useDrawer } from '#imports'

const { closeDrawer } = useDrawer()
</script>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: all 0.1s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
