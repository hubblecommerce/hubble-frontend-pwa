<template>
    <ProductDetailName :name-data="product.name" />
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { type HblProduct, type HblSlot } from '../../../types'
import { hblDetailData } from '../../../utils/helper'

const props = defineProps<{
    content: HblSlot
}>()

const product = inject<HblProduct>(hblDetailData)
</script>
