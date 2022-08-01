<template>
    <div class="card h-100">
        <NuxtLink :to="data.url" class="card-img-top">
            <img :src="data.media.url" class="d-block m-auto mw-100" height="200" :alt="data.name">
        </NuxtLink>
        <div class="card-body">
            <h5 class="card-title" v-text="data.name" />
            <div class="card-text">
                <div class="price">
                    <span v-if="data.price?.specialPrice" class="special-price" v-text="formatPrice(data.price.specialPrice)" />
                    <span :class="{ 'text-decoration-line-through': hasSpecialPrice }" v-text="formatPrice(data.price?.regularPrice)" />
                </div>
            </div>
        </div>
        <div class="card-footer d-flex flex-wrap justify-content-between">
            <NuxtLink :to="data.url" class="btn btn-primary text-center" role="button">
                Details
            </NuxtLink>
            <button class="btn btn-secondary text-center" role="button">
                Add To Cart
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Product, useCurrency } from '@hubblecommerce/hubble/dist/commons'

const props = defineProps<{
    data: Product
}>()

const { formatPrice } = useCurrency()

const hasSpecialPrice = computed(() => {
    return props.data?.price?.specialPrice
})
</script>
