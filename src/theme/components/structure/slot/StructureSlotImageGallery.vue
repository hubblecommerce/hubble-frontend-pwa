<template>
    <ProductDetailMediaGallery :media-data="product.media" />
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { type HblProduct, type HblSlot } from '@/utils/types'
import { hblDetailData } from '@/utils/helper'

const props = defineProps<{
    content: HblSlot
}>()

const product = inject<HblProduct>(hblDetailData)
</script>
