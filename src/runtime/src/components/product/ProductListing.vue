<template>
    <div class="flex justify-between mb-4">
        <div v-if="total">
            Total: {{ data.total }}
        </div>
        <div v-if="pagination">
            Page {{ data.page }} of {{ Math.ceil(data.total / data.limit) }}
        </div>
    </div>

    <div :class="gridClasses">
        <ProductListingCard v-for="product in data.products" :key="product.id" :data="product" />
    </div>
</template>

<script setup lang="ts">
import { ProductListing } from '@hubblecommerce/hubble/commons'

interface ProductListingProps {
    data: ProductListing,
    total?: boolean,
    pagination?: boolean,
    gridClasses?: string
}

withDefaults(defineProps<ProductListingProps>(), {
    total: true,
    pagination: true,
    gridClasses: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
})
</script>
