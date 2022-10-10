<template>
    <Transition name="fade" mode="out-in">
        <div v-if="cart?.lineItems.length > 0" class="flex flex-col gap-4">
            <div
                v-for="lineItem in cart.lineItems"
                :key="lineItem.index"
                class="flex pb-4 border border-l-0 border-r-0 border-t-0"
            >
                <div v-if="lineItem.type !== 'promotion'" class="avatar indicator mr-2">
                    <span class="indicator-item indicator-bottom badge badge-secondary">{{ lineItem.quantity }}</span>
                    <div class="w-20">
                        <img :src="lineItem.media?.url" :alt="lineItem.name">
                    </div>
                </div>
                <div class="flex flex-col justify-between w-full px-2">
                    <div class="w-full flex justify-between gap-2">
                        <div class="w-full">
                            {{ lineItem.name }}
                        </div>
                        <div v-if="isInteractive" class="btn btn-ghost btn-circle btn-xs" @click="removeLineItem(lineItem.id)">
                            <TrashIcon class="h-5 w-5" />
                        </div>
                    </div>
                    <div class="self-end w-full text-right text-sm">
                        <div v-if="lineItem.price.specialPrice" :class="{ 'line-through text-xs': lineItem.price.specialPrice }">
                            {{ formatPrice(lineItem.price.specialPrice) }}
                        </div>
                        <div :class="{ 'text-secondary': lineItem.price.specialPrice }">
                            {{ formatPrice(lineItem.price.regularPrice) }}
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
import { TrashIcon } from '@heroicons/vue/20/solid'
import { storeToRefs } from 'pinia'
import { useCart } from '#imports'
import { useCurrency } from '@hubblecommerce/hubble/commons'

interface CartListProps {
    isInteractive?: boolean
}

const props = withDefaults(defineProps<CartListProps>(), {
    isInteractive: true
})

const cartStore = useCart()
const { cart, loading, error } = storeToRefs(cartStore)
const { deleteCart, removeLineItem } = cartStore

const { formatPrice } = useCurrency()

const totalQty = computed(() => {
    let qty = 0
    cart.value?.lineItems.forEach((item) => {
        qty = qty + item.quantity
    })
    return qty
})
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
</style>
