<template>
    <div class="row">
        <div class="col-auto me-auto">
            Total: {{ data.total }}
        </div>
        <div class="col-auto">
            Page {{ data.page }} of {{ Math.ceil(data.total / data.limit) }}
        </div>
    </div>

    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div v-for="product in data.products" :key="product.id" class="col">
            <ProductDetail :data="product" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ProductListing } from '../../../commons'

const props = defineProps<{
    data: ProductListing
}>()
</script>
