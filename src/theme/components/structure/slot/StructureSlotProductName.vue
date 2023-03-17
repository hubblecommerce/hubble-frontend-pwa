<template>
    <ProductDetailName :name-data="product.name" />
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { HblProduct, HblSlot } from '@/utils/types'
import { detailData } from '@hubblecommerce/hubble/commons'

const props = defineProps<{
    content: HblSlot
}>()

const product = inject<HblProduct>(detailData)
</script>
