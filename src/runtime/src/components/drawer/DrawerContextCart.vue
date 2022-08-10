<template>
    <Transition name="fade" mode="out-in">
        <div v-if="loading" class="flex flex-col gap-4">
            <div class="flex justify-between items-center">
                <MiscSkeleton size="large" width="40%" />
                <MiscSkeleton size="large" circle />
            </div>
            <MiscSkeleton text size="small" :repeat="8" />
        </div>
        <div v-else-if="!loading" class="flex flex-col gap-4">
            <div class="flex justify-between items-center">
                <div class="text-2xl">
                    Cart
                </div>

                <div class="btn btn-ghost btn-circle" @click="closeDrawer">
                    <XIcon class="w-5 h-5" />
                </div>
            </div>
            <CartList />
            <CartTotals />
        </div>
        <div v-else-if="error">
            {{ error }}
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { XIcon } from '@heroicons/vue/outline'
import { useCart, useDrawer } from '#imports'

const { getCart, cart, loading, error, deleteCart } = useCart()
const { closeDrawer } = useDrawer()

// Set loading state to prevent flash old cart state before onMounted hook is finished
loading.value = true

onMounted(() => {
    getCart()
})
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
