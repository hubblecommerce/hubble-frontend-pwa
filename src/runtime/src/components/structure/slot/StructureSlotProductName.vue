<template>
    <ProductDetailName :name="product.name" />
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { Slot, Product, detailData } from '@hubblecommerce/hubble/commons'

const props = defineProps<{
    content: Slot
}>()

const product = inject<Product>(detailData)
</script>
