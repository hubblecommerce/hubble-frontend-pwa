<template>
    <ProductListing :data="content.productListing" />
</template>

<script setup lang="ts">
import { type HblSlot } from '../../../types'

const props = defineProps<{
    content: HblSlot
}>()
</script>
