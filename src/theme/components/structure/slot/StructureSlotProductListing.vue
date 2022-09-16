<template>
    <ProductListing :data="content.productListing" />
</template>

<script setup lang="ts">
import { Slot } from '@hubblecommerce/hubble/commons'

const props = defineProps<{
    content: Slot
}>()
</script>
