<template>
    <Transition name="fade" mode="out-in">
        <div v-if="cart?.lineItems.length > 0" class="flex flex-col gap-4">
            <div>Total: {{ totalQty }}</div>
            <div
                v-for="lineItem in cart.lineItems"
                :key="lineItem.index"
                class="grid grid-cols-12 pb-4 border border-l-0 border-r-0 border-t-0"
            >
                <img :src="lineItem.media.url" class="col-span-4">
                <div class="col-span-8 flex flex-col justify-between px-2">
                    <div class="w-full flex justify-between gap-2">
                        <div class="w-full">
                            {{ lineItem.name }}
                        </div>
                        <div class="btn btn-ghost btn-circle btn-xs" @click="removeLineItem(lineItem.id)">
                            <TrashIcon class="h-5 w-5" />
                        </div>
                    </div>
                    <div class="w-full text-sm">
                        <div>Quantity: {{ lineItem.quantity }}</div>
                    </div>
                    <div class="self-end w-full text-right text-sm">
                        <div :class="{'line-through text-xs': lineItem.price.specialPrice}">
                            {{ formatPrice(lineItem.price.regularPrice) }}
                        </div>
                        <div v-if="lineItem.price.specialPrice" class="text-accent">
                            {{ formatPrice(lineItem.price.specialPrice) }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            Your cart is empty
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { TrashIcon } from '@heroicons/vue/solid'
import { useCart } from '#imports'
import { useCurrency } from '@hubblecommerce/hubble/commons'

const { cart, loading, error, deleteCart, removeLineItem } = useCart()

const { formatPrice } = useCurrency()

const totalQty = computed(() => {
    let qty = 0
    cart.value?.lineItems.forEach((item) => {
        qty = qty + item.quantity
    })
    return qty
})
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
</style>
