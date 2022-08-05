<template>
    <div class="card card-compact bg-base-100 border border-base-200 shadow-md">
        <figure>
            <NuxtLink :to="data.url">
                <img v-if="data.media" :src="data.media.url" class="d-block m-auto mw-100" height="200" :alt="data.name">
                <img v-else src="~/assets/product/placeholder-image.png" class="d-block m-auto mw-100" height="200" :alt="data.name">
            </NuxtLink>
        </figure>
        <div class="card-body justify-between">
            <h2 class="card-title" v-text="data.name" />
            <div class="card-text">
                <div class="price">
                    <span v-if="data.price?.specialPrice" class="special-price" v-text="formatPrice(data.price.specialPrice)" />
                    <span :class="{ 'text-decoration-line-through': hasSpecialPrice }" v-text="formatPrice(data.price?.regularPrice)" />
                </div>
            </div>
            <div class="card-actions justify-center xl:justify-between">
                <NuxtLink :to="data.url" class="btn btn-primary text-center" role="button">
                    Details
                </NuxtLink>
                <button class="btn btn-secondary text-center" role="button">
                    Add To Cart
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Product, useCurrency } from '@hubblecommerce/hubble/commons'

const props = defineProps<{
    data: Product
}>()

const { formatPrice } = useCurrency()

const hasSpecialPrice = computed(() => {
    return props.data?.price?.specialPrice
})
</script>
