<template>
    <div class="card card-compact bg-base-100 border border-base-200 shadow-md transition hover:shadow-xl">
        <figure>
            <MiscLink no-prefetch :to="data.url">
                <img v-if="isLoading || data.media == null" src="~/assets/product/placeholder-image.png" class="d-block m-auto mw-100" height="300" :alt="data.name">
                <img v-else :src="image.src" :alt="data.name">
            </MiscLink>
        </figure>
        <div class="card-body justify-between gap-4">
            <h2 class="card-title items-start" v-text="data.name" />
            <div class="card-text">
                <div class="flex gap-2 items-center text-base">
                    <div v-if="data.price?.regularPrice" :class="{ 'text-secondary': data.price?.specialPrice}">
                        {{ formatPrice(data.price?.regularPrice) }}
                    </div>
                    <div v-if="data.price?.specialPrice" class="line-through text-sm">
                        {{ formatPrice(data.price?.specialPrice) }}
                    </div>
                </div>
            </div>
            <div class="card-actions justify-center xl:justify-between">
                <MiscLink no-prefetch :to="data.url" class="btn btn-primary text-center" role="button">
                    Details
                </MiscLink>
                <button
                    :class="{ 'loading': cartLoading }"
                    :disabled="cartLoading"
                    class="btn btn-secondary text-center"
                    role="button"
                    @click="onAddToCart()"
                >
                    Add To Cart
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useImage } from '@vueuse/core'
import { navigateTo } from '#app'
import { storeToRefs } from 'pinia'
import { Product, useCurrency } from '@hubblecommerce/hubble/commons'
import { useCart, useNotification } from '#imports'

const props = defineProps<{
    data: Product
}>()

const { formatPrice } = useCurrency()

const hasSpecialPrice = computed(() => {
    return props.data?.price?.specialPrice
})

const image = ref({
    src: Array.isArray(props.data.media) ? props.data.media[0]?.url : props.data.media?.url
})
const { isLoading } = useImage(image)

const cartStore = useCart()
const { loading: cartLoading, error: cartError } = storeToRefs(cartStore)
const { addToCart } = cartStore

async function onAddToCart () {
    if (props.data.parentId != null) {
        await navigateTo(props.data.url)
        return
    }

    await addToCart(1, props.data.id)
}

const { showNotification } = useNotification()
watch(cartError, (val) => {
    showNotification(val as string, 'error', true)
})
</script>

<style scoped>
.card-title {
    min-height: 84px;
}
</style>
