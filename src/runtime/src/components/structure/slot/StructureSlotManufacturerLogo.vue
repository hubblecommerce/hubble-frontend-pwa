<template>
    <ProductDetailManufacturer :manufacturer-data="product.manufacturer" />
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { detailData, Product, Slot } from '@hubblecommerce/hubble/commons'

const props = defineProps<{
    content: Slot
}>()

const product = inject<Product>(detailData)
</script>
