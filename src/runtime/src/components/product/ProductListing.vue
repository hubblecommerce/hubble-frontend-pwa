<template>
    <div class="flex justify-between mb-4">
        <div>
            Total: {{ data.total }}
        </div>
        <div>
            Page {{ data.page }} of {{ Math.ceil(data.total / data.limit) }}
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ProductListingCard v-for="product in data.products" :key="product.id" :data="product" />
    </div>
</template>

<script setup lang="ts">
import { ProductListing } from '@hubblecommerce/hubble/commons'

const props = defineProps<{
    data: ProductListing
}>()
</script>
