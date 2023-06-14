<template>
    <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
            <h2 class="card-title" v-text="product.name" />
            <div class="text-xs" v-text="product.sku" />

            <template v-if="product.active">
                <p>Availability: {{ product.stock > 10 ? 'in stock' : 'only a few left' }}</p>
                <p v-if="product.deliveryTime">
                    Delivery Time: {{ product.deliveryTime }}
                </p>

                <div class="flex gap-2 items-center">
                    <div v-if="product.price?.regularPrice" :class="{ 'text-secondary': product.price?.specialPrice}">
                        {{ formatPrice(product.price?.regularPrice) }}
                    </div>
                    <div v-if="product.price?.specialPrice" class="line-through text-sm">
                        {{ formatPrice(product.price?.specialPrice) }}
                    </div>
                </div>

                <ProductDetailVariants
                    v-if="product.variants != null"
                    :variants="product.variants"
                    :default-options="product.defaultOptions"
                    :parent-id="product.parentId"
                    @loading="variantLoading = $event"
                />

                <div class="card-actions justify-between items-end flex-nowrap">
                    <div class="form-control w-20">
                        <label for="quantity" class="label">
                            <span class="label-text">Quantity</span>
                        </label>
                        <input
                            id="quantity"
                            v-model="qty"
                            type="number"
                            min="1"
                            :max="product.stock"
                            class="input input-bordered input-secondary w-full max-w-xs"
                        >
                    </div>

                    <button :class="{'loading': loading}" :disabled="loading" class="btn btn-primary w-full flex-shrink" @click="onClickAddToCart(qty, product.id)">
                        <span v-if="!loading">Add to cart</span>
                    </button>
                </div>
            </template>

            <p v-else>
                Sorry, currently not available
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onBeforeUnmount } from 'vue'
import { useNuxtApp } from '#app'
import { storeToRefs } from 'pinia'
import { HblProduct } from '@/utils/types'
import { useCart, useNotification, useCurrency } from '#imports'

const props = defineProps<{
    productData: HblProduct
}>()

const product = ref(props.productData)
const { formatPrice } = useCurrency()
const qty = ref<number>(1)
const cartStore = useCart()
const { loading: cartLoading, error: cartError } = storeToRefs(cartStore)
const { addToCart } = cartStore
const { showNotification } = useNotification()
const variantLoading = ref(false)
const loading = computed(() => {
    return cartLoading.value || variantLoading.value
})

async function onClickAddToCart (qty: number, id: string) {
    await addToCart(qty, id)

    if (!cartError.value) {
        $hblBus.$emit('addToCart', { qty, product: product.value })
    }
}

watch(cartError, (value) => {
    showNotification(value, 'error', true)
})

const { $hblBus } = useNuxtApp()
$hblBus.$on('productVariantChanged', eventListenerBuyBox)

function eventListenerBuyBox ({ data }: { data: HblProduct }) {
    // Merge all data but the variants with the product data
    const { variants, ...productData } = data
    product.value = Object.assign(product.value, productData)
}

onBeforeUnmount(() => {
    $hblBus.$off('productVariantChanged', eventListenerBuyBox)
})
</script>
