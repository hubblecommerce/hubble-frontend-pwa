<template>
    <Transition name="fade" mode="out-in">
        <div v-if="cart?.lineItems.length > 0" class="flex flex-col gap-2">
            <div
                v-for="lineItem in cart.lineItems"
                :key="lineItem.index"
                class="relative flex items-start p-3 border rounded"
                :class="{
                    'bg-success-100 border-success text-success': lineItem.type === 'promotion',
                    'bg-base-100 border-base-300': lineItem.type !== 'promotion'
                }"
            >
                <div v-if="lineItem.type !== 'promotion'" class="avatar indicator mr-4">
                    <span class="indicator-item indicator-bottom badge border rounded border-secondary bg-secondary text-xs text-base-100 text-center p-1">×{{ lineItem.quantity }}</span>
                    <div class="w-16 h-16 border rounded border-base-300">
                        <img :src="lineItem.media?.url" :alt="lineItem.name">
                    </div>
                </div>
                <div v-if="lineItem.type === 'promotion'" class="mr-4 bg-base-100">
                    <div class="w-16 h-16 flex justify-center items-center border rounded border-success">
                        <BanknotesIcon class="w-8 h-8 fill-black" />
                    </div>
                </div>
                <div class="flex flex-col justify-between w-full">
                    <div class="w-full flex justify-between gap-2">
                        <div class="w-full pr-12">
                            <div class="font-bold leading-5">
                                {{ lineItem.name }}
                            </div>
                            <div v-if="lineItem.sku != null" class="text-xs leading-4 text-gray-500 font-medium mt-1">
                                {{ `${t('cart.lineItem.articleNumber')} ${lineItem.sku}` }}
                            </div>
                        </div>
                        <div v-if="isInteractive" class="absolute right-0 top-0 btn btn-ghost w-13 h-13" @click="onRemoveLineItem(lineItem)">
                            <TrashIcon class="w-5 h-5" />
                        </div>
                    </div>
                    <div v-if="lineItem.price.regularPrice != null" class="self-end w-full text-sm leading-5 text-right mt-1">
                        <div v-if="lineItem.price.specialPrice && lineItem.price.specialPrice > 0" :class="{ 'line-through text-xs': lineItem.price.specialPrice }">
                            {{ formatPrice(lineItem.price.specialPrice) }}
                        </div>
                        <div :class="{ 'text-secondary': lineItem.price.specialPrice }">
                            <template v-if="lineItem.price.regularPrice < 0">
                                - {{ formatPrice(lineItem.price.regularPrice * -1) }}
                            </template>
                            <template v-else-if="lineItem.price.regularPrice > 0">
                                {{ formatPrice(lineItem.price.regularPrice) }}
                            </template>
                            <template v-else />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            {{ t('cart.empty') }}
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { BanknotesIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { useCart, useCurrency, useNuxtApp } from '#imports'
import { type HblLineItem } from '../../types'

const { t } = useI18n()

interface CartListProps {
    isInteractive?: boolean
}

const props = withDefaults(defineProps<CartListProps>(), {
    isInteractive: true
})

const cartStore = useCart()
const { cart, loading, error } = storeToRefs(cartStore)
const { removeLineItem } = cartStore

const { formatPrice } = useCurrency()

const { $hblBus } = useNuxtApp()
async function onRemoveLineItem (lineItem: HblLineItem) {
    await removeLineItem(lineItem.id)

    if (!error.value) {
        $hblBus.$emit('removeFromCart', { product: lineItem })
    }
}
</script>

<style lang="postcss" scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>

<i18n>
{
    "en": {
        "cart.lineItem.articleNumber": "Article no.:",
        "cart.empty": "Your cart is empty"
    },
    "de": {
        "cart.lineItem.articleNumber": "Artikel-Nr.:",
        "cart.empty": "Ihr Warenkorb ist leer"
    }
}
</i18n>
