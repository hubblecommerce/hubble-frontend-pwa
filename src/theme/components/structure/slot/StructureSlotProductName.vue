<template>
    <ProductDetailName :name-data="product.name" />
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { HblProduct, HblSlot } from '@/utils/types'
import { hblDetailData } from '@/utils/helper'

const props = defineProps<{
    content: HblSlot
}>()

const product = inject<HblProduct>(hblDetailData)
</script>
