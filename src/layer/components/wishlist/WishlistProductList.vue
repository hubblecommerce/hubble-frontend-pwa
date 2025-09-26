<template>
    <Transition name="fade" mode="out-in">
        <div v-if="wishlist?.products.length > 0" class="flex flex-col gap-2">
            <div
                v-for="product in wishlist.products"
                :key="product.index"
                class="relative flex flex-col gap-2 items-start p-3 border rounded bg-base-100 border-base-300"
            >
                <div class="flex w-full">
                    <div class="avatar indicator mr-4">
                        <div class="w-16 h-16 border rounded border-base-300">
                            <MiscLink no-prefetch :to="product?.url">
                                <img :src="product.media?.url" :alt="product.name">
                            </MiscLink>
                        </div>
                    </div>
                    <div class="flex flex-col justify-between w-full">
                        <div class="w-full flex justify-between gap-2">
                            <div class="w-full pr-12">
                                <div class="font-bold leading-5">
                                    {{ product.name }}
                                </div>
                                <div v-if="product.sku != null" class="text-xs leading-4 text-gray-500 font-medium mt-1">
                                    {{ `${t('wishlist.product.articleNumber')} ${product.sku}` }}
                                </div>
                            </div>
                            <div class="absolute right-0 top-0 btn btn-ghost w-13 h-13" @click="onRemoveProduct(product)">
                                <TrashIcon class="w-5 h-5" />
                            </div>
                        </div>
                        <div v-if="product.price.regularPrice != null" class="self-end w-full text-sm leading-5 text-right mt-1">
                            <div v-if="product.price.specialPrice && product.price.specialPrice > 0" :class="{ 'line-through text-xs': product.price.specialPrice }">
                                {{ formatPrice(product.price.specialPrice) }}
                            </div>
                            <div :class="{ 'text-secondary': product.price.specialPrice }">
                                <template v-if="product.price.regularPrice < 0">
                                    - {{ formatPrice(product.price.regularPrice * -1) }}
                                </template>
                                <template v-else-if="product.price.regularPrice > 0">
                                    {{ formatPrice(product.price.regularPrice) }}
                                </template>
                                <template v-else />
                            </div>
                        </div>
                    </div>
                </div>

                <button :disabled="cartLoading" class="btn btn-sm btn-primary small h-4 w-full flex-shrink" @click="onClickAddToCart(1, product)">
                    <span v-if="cartLoading" class="loading" />
                    <span v-if="!cartLoading">{{ t('wishlist.product.addToCart') }}</span>
                </button>
            </div>
        </div>
        <div v-else>
            {{ t('wishlist.empty') }}
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { TrashIcon } from '@heroicons/vue/24/outline'
import { useWishlist, useCurrency, useCart, useNuxtApp } from '#imports'
import { type HblProduct } from '../../types'

const { t } = useI18n()

const wishlistStore = useWishlist()
const { wishlist, error: wishListError } = storeToRefs(wishlistStore)
const { removeFromWishlist } = wishlistStore
const cartStore = useCart()
const { loading: cartLoading, error: cartError } = storeToRefs(cartStore)
const { addToCart } = cartStore

const { formatPrice } = useCurrency()

const { $hblBus } = useNuxtApp()
async function onRemoveProduct (product: HblProduct) {
    await removeFromWishlist(product.id)

    if (!wishListError.value) {
        $hblBus.$emit('removeFromWishlist', { product })
    }
}

async function onClickAddToCart (qty: number, product: HblProduct) {
    await addToCart(qty, product.id)

    if (!cartError.value) {
        $hblBus.$emit('addToCart', { qty, product })
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
        "wishlist.product.articleNumber": "Article no.:",
        "wishlist.product.addToCart": "Add to cart",
        "wishlist.empty": "Your wishlist is empty"
    },
    "de": {
        "wishlist.product.articleNumber": "Artikel-Nr.:",
        "wishlist.product.addToCart": "Zum Warenkorb hinzufügen",
        "wishlist.empty": "Ihre Wunschliste ist leer"
    }
}
</i18n>
