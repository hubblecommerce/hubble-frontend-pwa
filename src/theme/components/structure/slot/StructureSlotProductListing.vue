<template>
    <ProductListing :data="content.productListing" />
</template>

<script setup lang="ts">
import { HblSlot } from '@/utils/types'

const props = defineProps<{
    content: HblSlot
}>()
</script>
